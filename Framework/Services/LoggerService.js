class Logger {
  print(data) {
    nodeApi.console.dir(data);
  }
}

LoggerProvider = () => {
  const logger = new Logger();
  return logger;
};
