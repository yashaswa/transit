import LoginRepository from "../repository/login-repository";

class LoginService {
  private userRepository: LoginRepository;

  constructor() {
    this.userRepository = new LoginRepository();
  }

  async create(name: string, email: string) {
    try {
      const user = await this.userRepository.createUser({ name, email });
      return user;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

  async getUser(email: string) {
    try {
      return await this.userRepository.getUserByEmail(email);
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      return await this.userRepository.deleteUser(id);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}

export default LoginService;
