#include <iostream>
#include <cmath> // Required for the pow() function
using namespace std;

int main() {
    double radius, area;
    const double PI = 3.14159;

    cout << "Enter the radius of the circle: ";
    cin >> radius;

    // Using pow(radius, 2) to calculate the squared radius
    area = PI * pow(radius, 2);

    cout << "Area of the circle: " << area << endl;
    
    return 0;
}