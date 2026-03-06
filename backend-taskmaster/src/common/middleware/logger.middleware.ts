// backend-taskmaster/src/common/middleware/logger.middleware.ts
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');

    use(req: Request, res: Response, next: NextFunction): void {
        const { method, originalUrl, ip } = req;
        const userAgent = req.get('user-agent') || '';
        const startTime = Date.now();

        // Log al iniciar la petición
        this.logger.log(`➡️  ${method} ${originalUrl} - IP: ${ip} - ${userAgent}`);

        // Escuchar cuando la respuesta termine
        res.on('finish', () => {
            const { statusCode } = res;
            const contentLength = res.get('content-length') || 0;
            const responseTime = Date.now() - startTime;

            // Elegir emoji según el código de estado
            let statusEmoji = '✅';
            if (statusCode >= 500) statusEmoji = '❌';
            else if (statusCode >= 400) statusEmoji = '⚠️';

            this.logger.log(
                `${statusEmoji} ${method} ${originalUrl} ${statusCode} - ${responseTime}ms - ${contentLength} bytes`
            );
        });

        next();
    }
}