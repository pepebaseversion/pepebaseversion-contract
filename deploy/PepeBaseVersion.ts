import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';


const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const accounts = await hre.getNamedAccounts();
    const deployer = accounts.admin;

    console.log((await hre.ethers.provider.getBalance(deployer)).toString());

    const {address: lib} = await hre.deployments.deploy(
        "IterableMapping",
        {from: deployer, log: true,}
    );

    console.log((await hre.ethers.provider.getBalance(deployer)).toString());

    await hre.run("verify:verify", {
        address: lib,
    });

    const args = [
        "0x10ed43c718714eb63d5aa57b78b54704e256024e", // pancake swap
        "0x55d398326f99059ff775485246999027b3197955", // usdt
        "0x5F5680b9F577dC9D2a8bdD55e305EcF3BeAB1C49",
    ];
    const {address} = await hre.deployments.deploy("PepeBaseVersion", {
        from: deployer,
        args: args,
        log: true,
        libraries: {
            IterableMapping: lib,
        }
    });

    console.log((await hre.ethers.provider.getBalance(deployer)).toString());

    await hre.run("verify:verify", {
        address: address,
        constructorArguments: args,
        libraries: {
            IterableMapping: lib,
        }
    });
};

func.tags = ["PepeBaseVersion"];

export default func;
