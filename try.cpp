#include <iostream>
using namespace std;

int main()
{
    int num1, num2;

    cout << "Enter two integer values: ";
    cin >> num1 >> num2;

    cout << "Sum: " << (num1 + num2) << endl;
    cout << "Difference: " << (num1 - num2) << endl;
    cout << "Product: " << (num1 * num2) << endl;

    if (num2 != 0)
    {
        cout << "Quotient: " << (num1 / num2) << endl;
    }
    else
    {
        cout << "Quotient: Undefined (Division by zero)" << endl;
    }

    return 0;
}