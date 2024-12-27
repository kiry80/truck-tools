import { createContext, useState, useEffect, useRef } from "react";
import { locale } from "@tauri-apps/plugin-os";
import {
	getStoredOsLocale,
	mostSimilarLang,
	storeOsLocale,
} from "@/utils/fileEdit";

// types
import { LocaleContextTypes } from "@/types/ContexTypes";
import { ProviderProps } from "@/types/ReactTypes";

// translations types
import {
	TranslationsTypes,
	Langs as LangsTypes,
} from "@/types/TranslationsTypes";

const getLang = async (lang: LangsTypes): Promise<TranslationsTypes> => {
	const res_lags = await import(`@/translations/${lang}.json`);

	return res_lags as TranslationsTypes;
};

const getCurrentLocale = async (): Promise<LangsTypes> => {
	const locale_store = await getStoredOsLocale();

	if (!locale_store) {
		const lang_locale = await locale();

		if (lang_locale) {
			const lang_similar = mostSimilarLang(lang_locale);
			await storeOsLocale(lang_similar);
			return lang_similar;
		}

		return "en-US";
	}

	return locale_store;
};

// eslint-disable-next-line react-refresh/only-export-components
export const LocaleContext = createContext<LocaleContextTypes>(
	{} as LocaleContextTypes
);

interface LangeState {
	lang: LangsTypes;
	translations: TranslationsTypes;
}

export const Locale = ({ children }: ProviderProps) => {
	const isLoaded = useRef(false);
	const [Lang, setLang] = useState<LangeState>({
		lang: "en-US",
		translations: {} as TranslationsTypes,
	});

	const changeLang = async (lang: LangsTypes) => {
		const translations = await getLang(lang);

		setLang({
			lang: lang,
			translations: translations,
		});

		await storeOsLocale(lang);
	};

	useEffect(() => {
		if (!isLoaded.current) {
			isLoaded.current = true;
			getCurrentLocale()
				.then((res) => changeLang(res))
				.catch(() => changeLang("en-US"));
		}
	}, []);

	return (
		<LocaleContext.Provider
			value={{ lang: Lang.lang, translations: Lang.translations, changeLang }}
		>
			{isLoaded.current && children}
		</LocaleContext.Provider>
	);
};
