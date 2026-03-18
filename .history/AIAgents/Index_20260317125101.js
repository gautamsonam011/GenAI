function sum(num1, num2) {
    return num1 + num2;
}

function prime(num) {
    if (num < 2)
        return false;

    for (let i = 2; i <= Math.sqrt(num); i++)
        if (num % i == 0)
            return false;
    return true;
}