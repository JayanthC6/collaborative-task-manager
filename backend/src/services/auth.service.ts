import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRepository } from '../repositories/auth.repository';
import { RegisterDTO, LoginDTO } from '../dtos/auth.dto';

export class AuthService {
    private authRepository: AuthRepository;

    constructor() {
        this.authRepository = new AuthRepository();
    }

    async register(data: RegisterDTO) {
        // Check if user already exists
        const existingUser = await this.authRepository.findUserByEmail(data.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create user
        const user = await this.authRepository.createUser(
            data.email,
            hashedPassword,
            data.name
        );

        // Generate token
        const token = this.generateToken(user.id);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            token,
        };
    }

    async login(data: LoginDTO) {
        // Find user
        const user = await this.authRepository.findUserByEmail(data.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        // Generate token
        const token = this.generateToken(user.id);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            token,
        };
    }

    async verifyToken(token: string) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
            const user = await this.authRepository.findUserById(decoded.userId);

            if (!user) {
                throw new Error('User not found');
            }

            return {
                id: user.id,
                email: user.email,
                name: user.name,
            };
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    async getAllUsers() {
        return this.authRepository.getAllUsers();
    }

    private generateToken(userId: string): string {
        return jwt.sign(
            { userId },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
        );
    }
}
