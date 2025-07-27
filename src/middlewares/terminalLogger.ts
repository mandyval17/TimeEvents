import Table from 'cli-table3';
import { NextFunction, Request, Response } from 'express';
// import fs from 'fs';
// import { join } from 'path';
import colors from 'picocolors';
// import { env } from '../env';

// const filePath = join(process.cwd(), 'logs', 'terminal');
// const logFilePath = join(filePath, 'log.log');

// create log directory if it doesn't exist
// if (!fs.existsSync(filePath)) {
// fs.mkdirSync(filePath, { recursive: true });
// }

export const terminalLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;

    const logEntry = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime: `${duration} ms`,
    };


    const table = new Table({
      head: [colors.cyan('Method'), colors.cyan('URL'), colors.cyan('Status'), colors.cyan('Response Time')],
      colWidths: [10, 50, 10, 15],
    });

    table.push([
      colors.green(logEntry.method),
      colors.blue(logEntry.url),
      colors.yellow(logEntry.status),
      colors.magenta(logEntry.responseTime),
    ]);

    console.log(table.toString());
  });

  next();
};
