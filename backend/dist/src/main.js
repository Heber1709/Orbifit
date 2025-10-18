"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe());
    const server = app.getHttpServer();
    const router = server._events.request._router;
    const availableRoutes = router.stack
        .map(layer => {
        if (layer.route) {
            return {
                path: layer.route?.path,
                method: layer.route?.stack[0].method,
            };
        }
    })
        .filter(item => item !== undefined);
    console.log('🛣️  RUTAS REGISTRADAS:');
    availableRoutes.forEach(route => {
        console.log(`${route.method.toUpperCase()} ${route.path}`);
    });
    await app.listen(3000);
    console.log('🚀 Application is running on: http://localhost:3000');
}
bootstrap();
//# sourceMappingURL=main.js.map