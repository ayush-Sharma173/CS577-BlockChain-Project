async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contract with the account:", deployer.address);

    const Charity = await ethers.getContractFactory("Charity");
    const charity = await Charity.deploy();

    console.log("Charity contract deployed to:", charity.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
