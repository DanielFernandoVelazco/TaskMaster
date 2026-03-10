// backend-taskmaster/src/common/middleware/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void {
        const { method, originalUrl } = req;
        const startTime = Date.now();

        console.log(`\n📨 ${method} ${originalUrl} - Petición recibida`);

        // Guardamos la función original de res.end para interceptarla
        const originalEnd = res.end;
        const chunk = [];

        // @ts-ignore - Sobrescribimos res.end para capturar el momento en que termina
        res.end = function (data?: any, encoding?: any, callback?: any) {
            const responseTime = Date.now() - startTime;
            const { statusCode } = res;

            // Elegir emoji según el código de estado
            let statusEmoji = '✅';
            if (statusCode >= 500) statusEmoji = '❌';
            else if (statusCode >= 400) statusEmoji = '⚠️';

            console.log(`📬 ${method} ${originalUrl} ${statusCode} ${statusEmoji} - ${responseTime}ms\n`);

            // Llamamos al método original
            originalEnd.apply(res, arguments);
        };

        next();
    }
}