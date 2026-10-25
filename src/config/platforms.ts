/** 這一期送審網站與 Android（Capacitor，見 android/）。iOS 只留欄位，不建置、不向 Apple 註冊。 */
export const platformPlan = {
	shipping: ['web', 'android'],
	reserved: ['ios'],
	appId: 'com.wuwaiter.yogurtguide',
	/**
	 * 目前 App 原生層的版本，要和 android/app/build.gradle 的 versionCode 一致。
	 * 新增 Capacitor 外掛或改權限時加 1 並重新上架；舊 App 不會下載需要新原生層的網頁包。
	 */
	nativeBuild: 1,
	/** Live Update：App 每次啟動檢查這個檔案，有新的網頁包就下載，下次開 App 生效。 */
	liveUpdateUrl: 'https://yogurtguide.wuwaiter.com/app-bundle/latest.json',
	iosBundleId: '',
	iosClientId: '',
} as const;
