import { isConnected, getPublicKey, signTransaction as lobstrSignTransaction } from "@lobstrco/signer-extension-api";

export const lobstrAdapter = {
    //Verifica si el usuario tiene la extensión LOBSTR instalada.
    async isInstalled(): Promise<boolean> {
        try {
            return await isConnected();
        } catch {
            return false;
        }
    },

    // Obtiene el public key del usuario.
    async getPublicKey(): Promise<string | null> {
        try {
            const key = await getPublicKey();
            return key || null;
        } catch {
            return null;
        }
    },

    // Firma una transacción XDR con LOBSTR
    async signTransaction(xdr: string): Promise<string> {
        type SignResultObject = { signedTxXdr?: string; signedTransaction?: string; signedXDR?: string; error?: string | { message: string } };
        const res: unknown = await lobstrSignTransaction(xdr);
        if (typeof res !== "string" && res !== null && res !== undefined) {
            const obj = res as SignResultObject;
            if (obj.error) {
                throw typeof obj.error === "string" ? new Error(obj.error) : obj.error;
            }
            return obj.signedTxXdr || obj.signedTransaction || obj.signedXDR || (res as unknown as string);
        }
        return typeof res === "string" ? res : "";
    },
};