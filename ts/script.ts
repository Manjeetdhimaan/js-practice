{
    function getFirstElement<T>(arr: T[]): T {
        return arr[0];
    }

    const numbers = [1, 2, 3, 4, 5];
    const firstNum = getFirstElement<number>(numbers);

    const strings = ["2", "3", "4", "5"];
    const firstString = getFirstElement<string>(strings);
}