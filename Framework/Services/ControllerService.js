class ControllerService {
  constructor(router, logger) {
    this.configuration;
    this.logger = logger;
    this.router = router;
    this.watchers = new Map();
    this.pathsToControllers = [];
  }

  async start(config) {
    const {controllers} = config;
    this.configuration = controllers;
    await this._detectController();
    await this._registerControllers();
    if (controllers.supervisor) {
      this._addSupervisor();
    }
  }

  _isJsFile(fileName) {
    const {
      path: {parse},
    } = npm;
    const {ext} = parse(fileName);
    return ext === '.js';
  }

  async _detectController() {
    const {
      configuration: {paths},
    } = this;
    const {
      fs: {promises: fsp},
      path,
    } = npm;
    const pathsToJSFiles = await Promise.all(
      paths.map(async (dirPath) => {
        const files = await fsp.readdir(dirPath);
        const jsFiles = await Promise.all(
          files.map(async (file) => {
            const pathToFile = path.join(dirPath, file);
            const stat = await fsp.stat(pathToFile);
            if (!stat.isFile()) return;
            return this._isJsFile(file) ? pathToFile : null;
          }),
        );
        return jsFiles.filter((file) => !!file);
      }),
    );
    this.pathsToControllers = pathsToJSFiles.flat();
    return this;
  }

  async _wrapController(controllerPath) {
    const context = {nodeApi, npm};
    const {
      vm,
      fs: {promises: fsp},
    } = npm;
    const src = await fsp.readFile(controllerPath);
    const sandbox = vm.createContext(context);
    const script = vm.createScript(src);
    const controller = script.runInNewContext(sandbox);
    return controller;
  }

  async _registerControllers() {
    const {router, pathsToControllers} = this;
    await Promise.all(
      pathsToControllers.map(async (controllerPath) => {
        const controller = await this._wrapController(controllerPath);
        router.registerEndpoint(controller);
      }),
    );
    return this;
  }

  _addSupervisor() {
    const {
      configuration: {paths},
    } = this;
    paths.map((path) => {
      this._watch(path);
    });
    return this;
  }

  _watch(dirPath) {
    const {fs} = npm;
    const {setTimeout} = nodeApi;
    const {router, watchers, _isJsFile, logger} = this;
    let watchWait = false;
    const watcher = fs.watch(dirPath, async (_, fileName) => {
      //try to prevent duplication of events
      if (watchWait) return;
      watchWait = setTimeout(() => {
        watchWait = false;
      }, 100);
      const filePath = npm.path.join(dirPath, fileName);
      try {
        const stat = await fs.promises.stat(filePath);
        if (stat.isFile()) {
          if (!_isJsFile(fileName)) return;
          const controller = await this._wrapController(filePath);
          if (!controller) return;
          const {handler, method, url} = controller;
          router.deleteController(handler);
          router.registerEndpoint(controller);
          logger.print(
            `The supervisor registered new endpoint: ${method}: ${url}`,
          );
        }
      } catch (err) {
        logger.print(err);
        return;
      }
    });
    watchers.set(dirPath, watcher);
    return this;
  }
}

ControllerServiceProvider = (router, logger) => {
  const controllerService = new ControllerService(router, logger);
  return controllerService;
};
