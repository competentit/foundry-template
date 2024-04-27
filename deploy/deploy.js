const { execSync } = require("child_process");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();
const { CHAIN_NAME, DEPLOYER_PRIVATE_KEY, GAS_PRICE, LEGACY, DEPLOY_RESET } =
  process.env;

const scriptsFolder = "./script/deploy/";

async function main() {
  if (DEPLOY_RESET === "true") {
    const chainId = execSync(`cast chain-id --rpc-url ${CHAIN_NAME}`, {
      encoding: "utf-8",
    }).trim();
    execSync(`rm -rf broadcast deployments/${chainId}`);
  }

  const files = fs.readdirSync(scriptsFolder);

  for (let file of files) {
    const filePath = `${scriptsFolder}${file}`;
    console.log(`Executing ${file}...`);
    execSync(
      `forge script ${filePath} --rpc-url ${CHAIN_NAME} --broadcast \
      --private-key ${DEPLOYER_PRIVATE_KEY} \
      ${LEGACY === "true" && `--legacy`} \
      ${GAS_PRICE && `--with-gas-price ${GAS_PRICE}`}`,
      { stdio: "inherit" },
    );
    execSync(`forge-deploy sync`, { stdio: "inherit" });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
