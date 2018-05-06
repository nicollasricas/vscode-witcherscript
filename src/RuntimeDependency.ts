export interface RuntimeDependency {
    description: string;
    url: string;
    installPath: string;
    installTestPath: string;
    tmp: string;
}