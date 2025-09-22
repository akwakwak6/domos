import { configRepo } from "../repositories/config.repositorie";
import { CredentialsDto } from "@shared/src/dto/config.dto";

const REPLACE_TOKEN = "*******************************************************************************";

class CredentialsService {
    async saveCredentials(url: string, token: string): Promise<void> {
        if (token === REPLACE_TOKEN) {
            const credentials = await configRepo.getCredentials();
            if (credentials && credentials.url === url) {
                token = credentials.token;
            }
        }

        await this.checkCredentials(url, token);

        await configRepo.saveCredentials(url, token);
        await configRepo.setIsConnected(true);
    }

    async getCredentials(): Promise<null | CredentialsDto> {
        const credentials = await configRepo.getCredentials();
        if (!credentials) {
            return null;
        }
        credentials.token = REPLACE_TOKEN;
        return credentials;
    }

    private async checkCredentials(url: string, token: string): Promise<void> {
        let response: Response;
        try {
            response = await fetch(`${url}api/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
        } catch (error) {
            throw Error(`invalid url : ${url}`);
        }
        if (!response.ok) {
            throw Error("invalid token");
        }
    }
}

export const credentialsService = new CredentialsService();
