import bcrypt from "bcryptjs";
import { ApiError } from "../utils/apiError";
import { userRepository } from "../repositories/user.repository";
import { signAccessToken } from "../utils/jwt";

export class AuthService {
  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.isActive) {
      throw new ApiError(401, "Invalid email or password");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new ApiError(401, "Invalid email or password");
    }

    await userRepository.updateLastLoginAt(user.id, new Date());

    const token = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    };
  }

  async signup(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new ApiError(409, "An account with this email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
    });

    if (!user) {
      throw new ApiError(500, "Failed to create account");
    }

    const token = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user || !user.isActive) {
      throw new ApiError(401, "Session expired. Please sign in again.");
    }

    return {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }
}

export const authService = new AuthService();
