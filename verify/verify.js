const { execSync } = require("child_process");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();
const { CHAIN_NAME, BL_CHAIN_EXPLORER_URL } = process.env;

const deploymentsFolder = "deployments/";
const extension = ".json";

async function main() {
  const chainId = execSync(`cast chain-id --rpc-url ${CHAIN_NAME}`, {
    encoding: "utf-8",
  }).trim();

  const folder = `${deploymentsFolder}${chainId}/`;
  const files = fs.readdirSync(folder);

  // first one is chain id
  for (let i = 1; i < files.length; i++) {
    const file = files[i];
    const filePath = `${folder}${file}`;
    const contractName = file.replace(extension, "");

    const proxyFile = `${contractName}_Proxy${extension}`;
    const proxyPath = `${folder}${proxyFile}`;
    const implementationFile = `${contractName}_Implementation${extension}`;
    const implementationPath = `${folder}${implementationFile}`;

    if (files.includes(proxyFile) && files.includes(implementationFile)) {
      const implementationData = JSON.parse(
        fs.readFileSync(implementationPath, "utf-8"),
      );
      execSync(
        `forge verify-contract --watch ${
          CHAIN_NAME == "bl_chain"
            ? `--verifier-url ${BL_CHAIN_EXPLORER_URL}`
            : `--chain ${CHAIN_NAME}`
        } \
        ${implementationData.address} ${contractName}`,
        { stdio: "inherit" },
      );

      const proxyData = JSON.parse(fs.readFileSync(proxyPath, "utf-8"));
      execSync(
        `forge verify-contract --watch ${
          CHAIN_NAME == "bl_chain"
            ? `--verifier-url ${BL_CHAIN_EXPLORER_URL}`
            : `--chain ${CHAIN_NAME}`
        } --constructor-args \
        ${proxyData.args_data} ${proxyData.address} EIP173Proxy`,
        { stdio: "inherit" },
      );

      i += 2;
    } else {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      execSync(
        `forge verify-contract --watch ${
          CHAIN_NAME == "bl_chain"
            ? `--verifier-url ${BL_CHAIN_EXPLORER_URL}`
            : `--chain ${CHAIN_NAME}`
        } --constructor-args \
        ${data.args_data} ${data.address} ${contractName}`,
        { stdio: "inherit" },
      );
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
