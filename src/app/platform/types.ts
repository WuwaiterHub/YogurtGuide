/** Android 這一期實作這些介面。iOS 以後補實作，呼叫端不改。 */

export interface SecureStore {
	get(key: string): Promise<string | null>;
	set(key: string, value: string): Promise<void>;
	remove(key: string): Promise<void>;
}

export interface CloudBackup {
	backup(): Promise<void>;
	restore(): Promise<void>;
	deleteRemote(): Promise<void>;
}
