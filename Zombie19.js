let peopleTree = {
    name: "Yohan",
    age: 35,
    infectionStatus: false,
    immunizeStatus: false,
    infectiousStatus: true,
    deathStatus: false,
    variants: [],
    friends: [
        {
            name: "Yanis",
            age: 30,
            infectionStatus: false,
            immunizeStatus: false,
            infectiousStatus: true,
            deathStatus: false,
            variants: []
        },
        {
            name: "Killian",
            age: 35,
            infectionStatus: false,
            immunizeStatus: false,
            infectiousStatus: true,
            deathStatus: false,
            variants: []
        },
        {
            name: "Thibaud",
            age: 22,
            infectionStatus: true,
            immunizeStatus: false,
            infectiousStatus: true,
            deathStatus: false,
            variants: ["ZombieA", "Zombie32"],
            friends: [
                {
                    name: "Samuel",
                    age: 25,
                    infectionStatus: false,
                    immunizeStatus: false,
                    infectiousStatus: true,
                    deathStatus: false,
                    variants: []
                },
                {
                    name: "Tony",
                    age: 28,
                    infectionStatus: true,
                    immunizeStatus: false,
                    infectiousStatus: true,
                    deathStatus: false,
                    variants: ["ZombieC"]
                },
                {
                    name: "Enzo",
                    age: 22,
                    infectionStatus: true,
                    immunizeStatus: false,
                    infectiousStatus: true,
                    deathStatus: false,
                    variants: ["ZombieB"],
                    friends: [
                        {
                            name: "Lucas",
                            age: 34,
                            infectionStatus: false,
                            immunizeStatus: false,
                            infectiousStatus: true,
                            deathStatus: false,
                            variants: []
                        },
                    ]
                },
                {
                    name: "Souleymane",
                    age: 22,
                    infectionStatus: false,
                    immunizeStatus: false,
                    infectiousStatus: true,
                    deathStatus: false,
                    variants: []
                },
            ]
        },
        {
            name: "Flavie",
            age: 25,
            infectionStatus: false,
            immunizeStatus: false,
            infectiousStatus: true,
            deathStatus: false,
            variants: [],
            friends: [
                {
                    name: "Chloe",
                    age: 22,
                    infectionStatus: true,
                    immunizeStatus: false,
                    infectiousStatus: true,
                    deathStatus: false,
                    variants: ["ZombieUltime"]
                },
                {
                    name: "Jenna",
                    age: 33,
                    infectionStatus: false,
                    immunizeStatus: false,
                    infectiousStatus: true,
                    deathStatus: false,
                    variants: []
                }
            ]
        }
    ]
};

//Function to detect if node can be infected
function canBeInfected(node, variant) {
    return !node.immunizeStatus && !node.deathStatus && node.infectiousStatus && !node.variants.includes(variant);
}

//Function infectZombieA that infects from top to bottom
function infectZombieA(node) {
    let newNode = JSON.parse(JSON.stringify(node));

    function propagateZombieAVariant(currentNode) {
        if (currentNode.immunizeStatus) {
            return currentNode;
        }

        if (currentNode.infectiousStatus && currentNode.variants.includes("ZombieA")) {
            if (currentNode.friends) {
                currentNode.friends = currentNode.friends.map(friend => {
                    if (canBeInfected(friend, "ZombieA")) {
                        friend.infectionStatus = true;
                        friend.variants.push("ZombieA");
                    }
                    return propagateZombieAVariant(friend);
                });
            }
        } else if (currentNode.friends) {
            currentNode.friends = currentNode.friends.map(propagateZombieAVariant);
        }

        return currentNode;
    }

    return propagateZombieAVariant(newNode);
}

let treeAfterZombieA = infectZombieA(peopleTree);
console.log("After Zombie-A infection", JSON.stringify(treeAfterZombieA));

console.log("--------------------------------------------------");

//InfectZombieB function that infects from bottom to top
function infectZombieB(node) {
    let newNode = JSON.parse(JSON.stringify(node));

    if (newNode.friends) {
        let infectedFriends = newNode.friends.map(infectZombieB);

        let hasZombieBVariant = infectedFriends.some(friend => friend.variants.includes("ZombieB") && friend.infectiousStatus && friend.infectionStatus);
        if (hasZombieBVariant && canBeInfected(newNode, "ZombieB")) {
            newNode.infectionStatus = true;
            newNode.variants.push("ZombieB");
        }

        newNode.friends = infectedFriends;
    }

    return newNode;
}

let treeAfterZombieB = infectZombieB(treeAfterZombieA);
console.log("After Zombie-B infection", JSON.stringify(treeAfterZombieB));

console.log("--------------------------------------------------");

//InfectZombieC function that infects 1 person out of 2 of same level
function infectZombieC(node) {
    let newNode = JSON.parse(JSON.stringify(node));

    if (newNode.friends && newNode.friends.length > 0) {
        const hasInfectedFriend = newNode.friends.some(friend => friend.infectionStatus && friend.variants.includes("ZombieC"));

        if (hasInfectedFriend) {
            for (let i = 0; i < newNode.friends.length; i++) {
                if (i % 2 === 0 && canBeInfected(newNode.friends[i], "ZombieC")) {
                    newNode.friends[i].infectionStatus = true;
                    newNode.friends[i].variants.push("ZombieC");
                }
                newNode.friends[i] = infectZombieC(newNode.friends[i]);
            }
        } else {
            for (let i = 0; i < newNode.friends.length; i++) {
                newNode.friends[i] = infectZombieC(newNode.friends[i]);
            }
        }
    }
    return newNode;
}

let treeAfterZombieC = infectZombieC(treeAfterZombieB);
console.log("After Zombie-C infection", JSON.stringify(treeAfterZombieC));

console.log("--------------------------------------------------");

function isThereAnyInfection(node) {
    if (node.infectionStatus && node.variants.includes("ZombieUltime") && node.infectiousStatus) {
        return true;
    }

    if (node.friends) {
        for (let friend of node.friends) {
            if (isThereAnyInfection(friend)) {
                return true;
            }
        }
    }

    return false;
}

//infectZombieUltime function that infects the root if there is any infection in the tree
function infectZombieUltime(node) {
    let newNode = JSON.parse(JSON.stringify(node));

    if (isThereAnyInfection(newNode)) {
        if (canBeInfected(newNode, "ZombieUltime")) {
            newNode.infectionStatus = true;
            newNode.variants.push("ZombieUltime");
        }
    }

    return newNode;
}

let treeAfterZombieUltime = infectZombieUltime(treeAfterZombieC);
console.log("After Zombie-Ultime variant spread", JSON.stringify(treeAfterZombieUltime));

console.log("--------------------------------------------------");

//infectZombie32 function that infects the descendants and ascendants friends if their age is 32 or more
function infectZombie32(node) {
    let newNode = JSON.parse(JSON.stringify(node));

    function infectDescendants(currentNode) {
        if (currentNode.age >= 32 && canBeInfected(currentNode, "Zombie32")){
            currentNode.infectionStatus = true;
            currentNode.variants.push("Zombie32");
        }

        if (currentNode.friends) {
            currentNode.friends.forEach(friend => {
                infectDescendants(friend);
            });
        }
    }

    function processNode(currentNode, ancestors) {
        let hasZombie32 = currentNode.variants.includes("Zombie32") && currentNode.infectiousStatus && currentNode.infectionStatus;

        if (hasZombie32) {
            infectDescendants(currentNode);
        }

        if (hasZombie32) {
            ancestors.forEach(ancestor => {
                if (ancestor.age >= 32 && canBeInfected(ancestor, "Zombie32")) {
                    ancestor.infectionStatus = true;
                    ancestor.variants.push("Zombie32");
                }
            });
        }

        if (currentNode.friends) {
            currentNode.friends.forEach(friend => {
                processNode(friend, [currentNode, ...ancestors]);
            });
        }
    }

    processNode(newNode, []);
    return newNode;
}

let treeAfterZombie32 = infectZombie32(treeAfterZombieUltime);
console.log("After Zombie-32 variant spread", JSON.stringify(treeAfterZombie32));

console.log("--------------------------------------------------");

//VaccineA1 function that vaccinates and immunizes people from 0 to 30 years old
function applyVaccineA1(node) {
    let newNode = JSON.parse(JSON.stringify(node));

    function vaccinateAndImmunize(person) {
        if (person.age > 0 && person.age <= 30 && (person.variants.includes("Zombie32") || person.variants.includes("ZombieA"))) {
            return { ...person, infectionStatus: false, immunizeStatus: true, variants: person.variants.filter(variant => variant !== "Zombie32" && variant !== "ZombieA")};
        } else {
            return person;
        }
    }

    function applyVaccineRecursively(currentNode) {
        currentNode = vaccinateAndImmunize(currentNode);
        if (currentNode.friends) {
            currentNode.friends = currentNode.friends.map(applyVaccineRecursively);
        }
        return currentNode;
    }

    return applyVaccineRecursively(newNode);
}

let treeAfterVaccineA1 = applyVaccineA1(treeAfterZombie32);
console.log("After Vaccine-A.1 application", JSON.stringify(treeAfterVaccineA1));

console.log("--------------------------------------------------");

//VaccineB1 function that vaccinates one person out of two and kill others without immunizing them
function applyVaccineB1(node) {
    let newNode = JSON.parse(JSON.stringify(node));

    let counter = { value: 0 };

    function applySelectiveVaccine(currentNode) {
        if (currentNode.infectionStatus && (currentNode.variants.includes("ZombieB") || currentNode.variants.includes("ZombieC"))) {
            if (counter.value % 2 === 0) {
                currentNode.infectionStatus = false;
                currentNode.variants = currentNode.variants.filter(variant => variant !== "ZombieB" && variant !== "ZombieC");
            } else {
                currentNode.deathStatus = true;
            }
            counter.value++;
        }

        if (currentNode.friends) {
            currentNode.friends = currentNode.friends.map(applySelectiveVaccine);
        }
        return currentNode;
    }

    return applySelectiveVaccine(newNode);
}

let treeAfterVaccineB1 = applyVaccineB1(treeAfterZombie32);
console.log("After Vaccine-B.1 application", JSON.stringify(treeAfterVaccineB1));

console.log("--------------------------------------------------");

//VaccineUltime function that vaccinates root giving him non-infectious and immunized status
function applyVaccineUltime(node) {
    let newNode = JSON.parse(JSON.stringify(node));

    function vaccinateAndImmunize(currentNode) {
        return { ...currentNode, infectionStatus: false, immunizeStatus: true, infectiousStatus: false, variants: currentNode.variants.filter(variant => variant !== "ZombieUltime")};
    }

    if(newNode.variants.includes("ZombieUltime") && newNode.infectionStatus) {
        newNode = vaccinateAndImmunize(newNode);
    }

    return newNode;
}

let treeAfterVaccineUltime = applyVaccineUltime(treeAfterZombie32);
console.log("After Vaccine-Ultime application", JSON.stringify(treeAfterVaccineUltime));