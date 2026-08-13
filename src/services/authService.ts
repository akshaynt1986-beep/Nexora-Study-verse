import { UserAccount, UserStats } from '../types';
import { INITIAL_USER_STATS } from '../data/initialData';

const ACCOUNTS_KEY = 'nexora_accounts';
const CURRENT_SESSION_KEY = 'nexora_active_session_id';

export class AuthService {
  static getAccounts(): UserAccount[] {
    try {
      const saved = localStorage.getItem(ACCOUNTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  static saveAccounts(accounts: UserAccount[]): void {
    try {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error('Failed to save accounts', e);
    }
  }

  static getActiveAccountId(): string | null {
    try {
      return localStorage.getItem(CURRENT_SESSION_KEY);
    } catch {
      return null;
    }
  }

  static setActiveAccountId(id: string | null): void {
    try {
      if (id) {
        localStorage.setItem(CURRENT_SESSION_KEY, id);
      } else {
        localStorage.removeItem(CURRENT_SESSION_KEY);
      }
    } catch (e) {
      console.error('Failed to set active account ID', e);
    }
  }

  static getCurrentAccount(): UserAccount | null {
    const id = AuthService.getActiveAccountId();
    if (!id) return null;
    const accounts = AuthService.getAccounts();
    return accounts.find((a) => a.id === id) || null;
  }

  static signUp(
    name: string,
    email: string,
    passwordHash: string,
    exam: 'JEE' | 'NEET',
    targetYear: number
  ): UserAccount {
    const accounts = AuthService.getAccounts();
    const existing = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newAccount: UserAccount = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name,
      email,
      passwordHash,
      exam,
      classGrade: '12',
      targetYear,
      targetExam: exam === 'JEE' ? 'JEE Main' : 'NEET',
      targetScoreRank: exam === 'JEE' ? '99.5+ Percentile' : '680+ Score',
      dailyStudyHours: 8,
      prepLevel: 'Not Started',
      isOnboarded: false,
      createdAt: new Date().toISOString(),
    };

    accounts.push(newAccount);
    AuthService.saveAccounts(accounts);
    AuthService.setActiveAccountId(newAccount.id);

    // Initialize user-isolated zero stats
    const statsKey = `nexora_stats_${newAccount.id}`;
    localStorage.setItem(statsKey, JSON.stringify(INITIAL_USER_STATS));

    return newAccount;
  }

  static login(email: string, passwordHash: string): UserAccount {
    const accounts = AuthService.getAccounts();
    const account = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (!account) {
      throw new Error('Account not found. Please check your email or sign up.');
    }
    if (account.passwordHash && account.passwordHash !== passwordHash) {
      throw new Error('Incorrect password. Please try again.');
    }

    AuthService.setActiveAccountId(account.id);
    return account;
  }

  static updateAccount(updated: UserAccount): void {
    const accounts = AuthService.getAccounts();
    const index = accounts.findIndex((a) => a.id === updated.id);
    if (index !== -1) {
      accounts[index] = updated;
      AuthService.saveAccounts(accounts);
    }
  }

  static logout(): void {
    AuthService.setActiveAccountId(null);
  }

  static getUserStats(accountId: string): UserStats {
    try {
      const statsKey = `nexora_stats_${accountId}`;
      const saved = localStorage.getItem(statsKey);
      return saved ? JSON.parse(saved) : INITIAL_USER_STATS;
    } catch {
      return INITIAL_USER_STATS;
    }
  }

  static saveUserStats(accountId: string, stats: UserStats): void {
    try {
      const statsKey = `nexora_stats_${accountId}`;
      localStorage.setItem(statsKey, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to save user stats', e);
    }
  }
}
