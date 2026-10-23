/** 這一期送審網站與 Android（Capacitor，見 android/）。iOS 只留欄位，不建置、不向 Apple 註冊。 */
export const platformPlan = {
	shipping: ['web', 'android'],
	reserved: ['ios'],
	appId: 'com.wuwaiter.yogurtguide',
	iosBundleId: '',
	iosClientId: '',
} as const;
