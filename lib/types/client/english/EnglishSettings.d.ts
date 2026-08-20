export interface ProviderModels {
    provider: string;
    providerName: string;
    models: Array<{
        id: string;
        name: string;
    }>;
}
export interface EnglishSettingsProps {
}
export declare function EnglishSettings(_props: EnglishSettingsProps): JSX.Element;
