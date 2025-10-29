import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Car, Home, Plane, Zap, Calculator as CalcIcon } from "lucide-react";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const Calculator = () => {
  const [electricity, setElectricity] = useState(300);
  const [gas, setGas] = useState(50);
  const [carMiles, setCarMiles] = useState(500);
  const [flights, setFlights] = useState(2);

  // Rough CO2 calculations (kg CO2 per unit)
  const electricityFactor = 0.5; // kg CO2 per kWh
  const gasFactor = 5.3; // kg CO2 per therm
  const carFactor = 0.4; // kg CO2 per mile
  const flightFactor = 250; // kg CO2 per flight

  const electricityCO2 = electricity * electricityFactor;
  const gasCO2 = gas * gasFactor;
  const carCO2 = carMiles * carFactor;
  const flightsCO2 = flights * flightFactor;

  const totalCO2 = electricityCO2 + gasCO2 + carCO2 + flightsCO2;
  const monthlyTotal = (totalCO2 / 12).toFixed(2);
  const tokensEquivalent = Math.floor(totalCO2 / 3); // Rough estimate

  const chartData = [
    { name: "Electricity", value: electricityCO2, color: "hsl(95, 60%, 45%)" },
    { name: "Natural Gas", value: gasCO2, color: "hsl(95, 50%, 35%)" },
    { name: "Transportation", value: carCO2, color: "hsl(95, 40%, 50%)" },
    { name: "Flights", value: flightsCO2, color: "hsl(95, 70%, 30%)" },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">GHG Carbon Calculator</h1>
            <p className="text-muted-foreground">
              Calculate your annual carbon footprint and see how many tokens you need to offset it
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Input Form */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Annual Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Electricity */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Zap className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <Label>Electricity (kWh/month)</Label>
                      <p className="text-sm text-muted-foreground">Average household: 877 kWh</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <Slider 
                      value={[electricity]} 
                      onValueChange={(val) => setElectricity(val[0])}
                      max={1500}
                      step={10}
                      className="flex-1"
                    />
                    <Input 
                      type="number" 
                      value={electricity} 
                      onChange={(e) => setElectricity(Number(e.target.value))}
                      className="w-24"
                    />
                  </div>
                  <p className="text-sm text-right">
                    <span className="text-accent font-semibold">{electricityCO2.toFixed(0)} kg CO₂</span> per year
                  </p>
                </div>

                {/* Natural Gas */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Home className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <Label>Natural Gas (therms/month)</Label>
                      <p className="text-sm text-muted-foreground">Average household: 40 therms</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <Slider 
                      value={[gas]} 
                      onValueChange={(val) => setGas(val[0])}
                      max={150}
                      step={5}
                      className="flex-1"
                    />
                    <Input 
                      type="number" 
                      value={gas} 
                      onChange={(e) => setGas(Number(e.target.value))}
                      className="w-24"
                    />
                  </div>
                  <p className="text-sm text-right">
                    <span className="text-accent font-semibold">{gasCO2.toFixed(0)} kg CO₂</span> per year
                  </p>
                </div>

                {/* Car Travel */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Car className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <Label>Car Travel (miles/month)</Label>
                      <p className="text-sm text-muted-foreground">Average: 1,000 miles</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <Slider 
                      value={[carMiles]} 
                      onValueChange={(val) => setCarMiles(val[0])}
                      max={3000}
                      step={50}
                      className="flex-1"
                    />
                    <Input 
                      type="number" 
                      value={carMiles} 
                      onChange={(e) => setCarMiles(Number(e.target.value))}
                      className="w-24"
                    />
                  </div>
                  <p className="text-sm text-right">
                    <span className="text-accent font-semibold">{carCO2.toFixed(0)} kg CO₂</span> per year
                  </p>
                </div>

                {/* Flights */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Plane className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <Label>Round-trip Flights (per year)</Label>
                      <p className="text-sm text-muted-foreground">Average: 1-2 flights</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <Slider 
                      value={[flights]} 
                      onValueChange={(val) => setFlights(val[0])}
                      max={20}
                      step={1}
                      className="flex-1"
                    />
                    <Input 
                      type="number" 
                      value={flights} 
                      onChange={(e) => setFlights(Number(e.target.value))}
                      className="w-24"
                    />
                  </div>
                  <p className="text-sm text-right">
                    <span className="text-accent font-semibold">{flightsCO2.toFixed(0)} kg CO₂</span> per year
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Carbon Footprint</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6 rounded-lg bg-accent/10">
                    <p className="text-sm text-muted-foreground mb-2">Annual Total</p>
                    <p className="text-4xl font-bold text-accent">{totalCO2.toFixed(0)}</p>
                    <p className="text-sm text-muted-foreground mt-1">kg CO₂</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Monthly Average</span>
                      <span className="font-semibold">{monthlyTotal} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tokens to Offset</span>
                      <span className="font-semibold text-accent">{tokensEquivalent.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button variant="gradient" className="w-full">
                    <CalcIcon className="mr-2 w-4 h-4" />
                    Offset Your Footprint
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }} 
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Info Banner */}
          <Card className="bg-accent/5">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">About Carbon Calculations</h3>
              <p className="text-sm text-muted-foreground">
                These calculations use standard EPA emission factors. Your actual footprint may vary based on 
                location, energy sources, and lifestyle choices. Consider earning carbon tokens through verified 
                sustainable actions to offset your emissions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
