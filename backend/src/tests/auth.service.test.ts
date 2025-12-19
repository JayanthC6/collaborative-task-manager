import { AuthService } from '../services/auth.service';
import { AuthRepository } from '../repositories/auth.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock dependencies
jest.mock('../repositories/auth.repository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
    let authService: AuthService;
    let mockAuthRepository: jest.Mocked<AuthRepository>;

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();

        authService = new AuthService();
        mockAuthRepository = new AuthRepository() as jest.Mocked<AuthRepository>;
        (authService as any).authRepository = mockAuthRepository;
    });

    describe('register', () => {
        it('should successfully register a new user', async () => {
            // Arrange
            const registerData = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
            };

            const hashedPassword = 'hashed_password';
            const mockUser = {
                id: 'user-123',
                email: registerData.email,
                password: hashedPassword,
                name: registerData.name,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockAuthRepository.findUserByEmail.mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
            mockAuthRepository.createUser.mockResolvedValue(mockUser);
            (jwt.sign as jest.Mock).mockReturnValue('mock_token');

            // Act
            const result = await authService.register(registerData);

            // Assert
            expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith(registerData.email);
            expect(bcrypt.hash).toHaveBeenCalledWith(registerData.password, 10);
            expect(mockAuthRepository.createUser).toHaveBeenCalledWith(
                registerData.email,
                hashedPassword,
                registerData.name
            );
            expect(result).toEqual({
                user: {
                    id: mockUser.id,
                    email: mockUser.email,
                    name: mockUser.name,
                },
                token: 'mock_token',
            });
        });

        it('should throw error if user already exists', async () => {
            // Arrange
            const registerData = {
                email: 'existing@example.com',
                password: 'password123',
                name: 'Test User',
            };

            const existingUser = {
                id: 'user-123',
                email: registerData.email,
                password: 'hashed',
                name: 'Existing User',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockAuthRepository.findUserByEmail.mockResolvedValue(existingUser);

            // Act & Assert
            await expect(authService.register(registerData)).rejects.toThrow(
                'User with this email already exists'
            );
            expect(mockAuthRepository.createUser).not.toHaveBeenCalled();
        });

        it('should hash password before storing', async () => {
            // Arrange
            const registerData = {
                email: 'test@example.com',
                password: 'plaintext_password',
                name: 'Test User',
            };

            mockAuthRepository.findUserByEmail.mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
            mockAuthRepository.createUser.mockResolvedValue({
                id: 'user-123',
                email: registerData.email,
                password: 'hashed_password',
                name: registerData.name,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            (jwt.sign as jest.Mock).mockReturnValue('token');

            // Act
            await authService.register(registerData);

            // Assert
            expect(bcrypt.hash).toHaveBeenCalledWith('plaintext_password', 10);
            expect(mockAuthRepository.createUser).toHaveBeenCalledWith(
                registerData.email,
                'hashed_password',
                registerData.name
            );
        });
    });

    describe('login', () => {
        it('should successfully login with valid credentials', async () => {
            // Arrange
            const loginData = {
                email: 'test@example.com',
                password: 'password123',
            };

            const mockUser = {
                id: 'user-123',
                email: loginData.email,
                password: 'hashed_password',
                name: 'Test User',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockAuthRepository.findUserByEmail.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('mock_token');

            // Act
            const result = await authService.login(loginData);

            // Assert
            expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith(loginData.email);
            expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
            expect(result).toEqual({
                user: {
                    id: mockUser.id,
                    email: mockUser.email,
                    name: mockUser.name,
                },
                token: 'mock_token',
            });
        });

        it('should throw error if user not found', async () => {
            // Arrange
            const loginData = {
                email: 'nonexistent@example.com',
                password: 'password123',
            };

            mockAuthRepository.findUserByEmail.mockResolvedValue(null);

            // Act & Assert
            await expect(authService.login(loginData)).rejects.toThrow('Invalid credentials');
            expect(bcrypt.compare).not.toHaveBeenCalled();
        });

        it('should throw error if password is invalid', async () => {
            // Arrange
            const loginData = {
                email: 'test@example.com',
                password: 'wrong_password',
            };

            const mockUser = {
                id: 'user-123',
                email: loginData.email,
                password: 'hashed_password',
                name: 'Test User',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockAuthRepository.findUserByEmail.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            // Act & Assert
            await expect(authService.login(loginData)).rejects.toThrow('Invalid credentials');
        });
    });

    describe('verifyToken', () => {
        it('should successfully verify valid token', async () => {
            // Arrange
            const token = 'valid_token';
            const decoded = { userId: 'user-123' };
            const mockUser = {
                id: 'user-123',
                email: 'test@example.com',
                password: 'hashed',
                name: 'Test User',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (jwt.verify as jest.Mock).mockReturnValue(decoded);
            mockAuthRepository.findUserById.mockResolvedValue(mockUser);

            // Act
            const result = await authService.verifyToken(token);

            // Assert
            expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
            expect(mockAuthRepository.findUserById).toHaveBeenCalledWith('user-123');
            expect(result).toEqual({
                id: mockUser.id,
                email: mockUser.email,
                name: mockUser.name,
            });
        });

        it('should throw error for invalid token', async () => {
            // Arrange
            const token = 'invalid_token';
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error('jwt malformed');
            });

            // Act & Assert
            await expect(authService.verifyToken(token)).rejects.toThrow('Invalid token');
        });

        it('should throw error if user not found after token verification', async () => {
            // Arrange
            const token = 'valid_token';
            const decoded = { userId: 'user-123' };

            (jwt.verify as jest.Mock).mockReturnValue(decoded);
            mockAuthRepository.findUserById.mockResolvedValue(null);

            // Act & Assert
            await expect(authService.verifyToken(token)).rejects.toThrow('Invalid token');
        });
    });
});
