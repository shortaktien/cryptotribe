import { useState, useEffect, useCallback } from 'react';
import { calculateNetProduction, updateResources, updateResearchEffects } from '../utils/resourceManager'; // Korrekte Importe

const useResources = () => {
    const [resources, setResources] = useState({
        water: 250,
        food: 250,
        wood: 300,
        stone: 100,
        knowledge: 0,
        population: 15,
        coal: 0,
        gold: 0,
        military: 0,
    });

    const [productionRates, setProductionRates] = useState({
        water: 40 / 3600,
        food: 35 / 3600,
        wood: 33 / 3600,
        stone: 29 / 3600,
        knowledge: 1 / 3600,
        population: 1 / 3600,
        coal: 15 / 3600,
        gold: 0.01 / 3600,
    });

    const [capacityRates, setCapacityRates] = useState({
        water: 500,
        food: 500,
        wood: 500,
        stone: 500,
        knowledge: 100,
        population: 15,
        coal: 500,
        gold: 500,
        military: 0,
        maxMilitaryCapacity: 0,
    });

    const [researchEffects, setResearchEffects] = useState({ food: 0 });

    const calculateAndUpdateResources = useCallback(() => {
        const netProduction = calculateNetProduction(productionRates, researchEffects, resources.population); // Verwendet importierte Funktion
        const newResources = updateResources(resources, netProduction, capacityRates); // Verwendet importierte Funktion
        setResources(newResources);
    }, [productionRates, researchEffects, resources, capacityRates]);

    useEffect(() => {
        const interval = setInterval(calculateAndUpdateResources, 1000);
        return () => clearInterval(interval);
    }, [calculateAndUpdateResources]);

    const updateProductionRate = (resource, rate) => {
        setProductionRates(prevRates => ({ ...prevRates, [resource]: rate }));
    };

    const updateCapacityRates = (resource, amount) => {
        setCapacityRates(prevCapacityRates => ({ ...prevCapacityRates, [resource]: amount }));

        if (resource === 'military') {
            setResources(prevResources => ({
                ...prevResources,
                military: Math.min(prevResources.military + amount, capacityRates.maxMilitaryCapacity),
            }));
        }
    };

    const updatePopulation = (population) => {
        setResources(prevResources => ({ ...prevResources, population: prevResources.population + population }));
    };

    const spendResources = (cost) => {
        const updatedResources = { ...resources };
        for (const [resource, amount] of Object.entries(cost)) {
            if (updatedResources[resource] < amount) {
                return false;
            }
            updatedResources[resource] -= amount;
        }
        setResources(updatedResources);
        return true;
    };

    const refundResources = (refund) => {
        setResources(prevResources => {
            const newResources = { ...prevResources };
            for (const [resource, amount] of Object.entries(refund)) {
                newResources[resource] += amount;
            }
            return newResources;
        });
    };

    const getNetProductionRates = () => calculateNetProduction(productionRates, researchEffects, resources.population); // Importierte Funktion verwenden
    const getProductionRates = () => productionRates;

    const setLoadedProductionRates = (loadedProductionRates) => {
        setProductionRates(prevRates => ({ ...prevRates, ...loadedProductionRates }));
    };

    const setLoadedCapacityRates = (loadedCapacityRates) => {
        setCapacityRates(prevRates => ({ ...prevRates, ...loadedCapacityRates }));
    };

    return {
        resources,
        setResources,
        updateProductionRate,
        spendResources,
        updateCapacityRates,
        updatePopulation,
        updateResearchEffects,
        capacityRates,
        setResearchEffects,
        setCapacityRates,
        refundResources,
        getNetProductionRates,
        getProductionRates,
        setLoadedProductionRates,
        setLoadedCapacityRates,
    };
};

export default useResources;
