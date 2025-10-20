import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
export declare class AuthController {
    private authService;
    private usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            username: any;
            firstName: any;
            lastName: any;
            role: any;
            position: any;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.UserRole;
            position: import(".prisma/client").$Enums.PlayerPosition;
        };
    }>;
    forgotPassword(body: {
        email: string;
    }): Promise<any>;
    resetPassword(body: {
        token: string;
        newPassword: string;
    }): Promise<{
        success: boolean;
        message: string;
        note: string;
    }>;
    changePasswordDirectly(body: {
        email: string;
        newPassword: string;
    }): Promise<{
        success: boolean;
        message: string;
        user?: undefined;
    } | {
        success: boolean;
        message: string;
        user: {
            id: number;
            email: string;
            firstName: string;
        };
    }>;
}
