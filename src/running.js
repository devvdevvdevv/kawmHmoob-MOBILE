function washingDishes(dishes){

    const cleanDishes = []

    if (!dishes){
        return
    }

    for (let i= 0; i< dishes.length; i++){

        if (!cleanDishes.includes(dishes[i]))

        cleanDishes.push(dishes[i] + ' is clean')

    }


    return cleanDishes



}

// 

 
console.log(washingDishes(['plate', 'cup', 'plate', 'fork', 'spoon', 'cup']))