import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const userId = ID.unique();
            if (!this.isValidUserId(userId)) {
                throw new Error('Generated user ID is invalid');
            }

            const userAccount = await this.account.create(userId, email, password, name);
            if (userAccount) {
                await this.account.updatePrefs(userAccount.$id, { role: 'user' });
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            console.error('Error creating account:', error);
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            if (!email || !password) {
                throw new Error('Email or password is missing');
            }

            const session = await this.account.createEmailPasswordSession(email, password);
            localStorage.setItem('sessionToken', session.$id);
            return session;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }


    async getCurrentUser() {
        try {
            const session = localStorage.getItem('sessionToken');
            if (!session) return null;

            this.client.setJWT(session);
            const user = await this.account.get();

            if (user.prefs.role !== "user") {
                console.error("User does not have the 'user' role");
                return null;
            }

            return user;
        } catch (error) {
            console.error("Appwrite service::getCurrentUser::error", error);
            localStorage.removeItem('sessionToken');
            return null;
        } finally {
            this.client.setJWT('');
        }
    }

    async logout() {
        try {
            await this.account.deleteSessions();
            localStorage.removeItem('sessionToken');
        } catch (error) {
            console.error("Appwrite service::logout::error", error);
        }
    }

    isValidUserId(userId) {
        const regex = /^[a-zA-Z0-9._-]{1,36}$/;
        return regex.test(userId);
    }
}

const authService = new AuthService();
export default authService;
