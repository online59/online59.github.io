import 'package:flutter/material.dart';
import 'dart:math';

class IntrinsicValueCalculator extends StatefulWidget {
  const IntrinsicValueCalculator({super.key});

  @override
  State<IntrinsicValueCalculator> createState() =>
      _IntrinsicValueCalculatorState();
}

class _IntrinsicValueCalculatorState extends State<IntrinsicValueCalculator> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _averageEarningsController =
      TextEditingController();
  final TextEditingController _discountRateController = TextEditingController();
  final TextEditingController _growthRateController = TextEditingController();
  final TextEditingController _yearsController = TextEditingController();
  double? _intrinsicValue;

  void _calculateIntrinsicValue() {
    if (_formKey.currentState!.validate()) {
      try {
        // Parse inputs
        double averageEarnings =
            double.parse(_averageEarningsController.text.trim());
        double discountRate = double.parse(_discountRateController.text.trim());
        double growthRate = double.parse(_growthRateController.text.trim());
        int years = int.parse(_yearsController.text.trim());

        // Validation checks
        if (averageEarnings < 0 ||
            discountRate <= 0 ||
            growthRate < 0 ||
            years <= 0) {
          throw Exception("Invalid input values.");
        }

        // Calculate future earnings and discounted cash flows
        double intrinsicValue = 0.0;
        for (int t = 1; t <= years; t++) {
          double futureEarning = averageEarnings * pow((1 + growthRate), t);
          double discountedCashFlow =
              futureEarning / pow((1 + discountRate), t);
          intrinsicValue += discountedCashFlow;
        }

        // Update state with results
        setState(() {
          _intrinsicValue = intrinsicValue;
        });
      } catch (e) {
        // Handle parsing or calculation errors
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
              content: Text('Error in calculation. Please check inputs.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              _buildTextField(
                controller: _averageEarningsController,
                label: "Average Owner's Earnings (in million Baht)",
                validator: (value) => value == null || value.isEmpty
                    ? 'Please enter earnings'
                    : null,
              ),
              _buildTextField(
                controller: _discountRateController,
                label: 'Discount Rate (as decimal, e.g., 0.20 for 20%)',
                validator: (value) => value == null || value.isEmpty
                    ? 'Please enter discount rate'
                    : null,
              ),
              _buildTextField(
                controller: _growthRateController,
                label: 'Growth Rate (as decimal, e.g., 0.05 for 5%)',
                validator: (value) => value == null || value.isEmpty
                    ? 'Please enter growth rate'
                    : null,
              ),
              _buildTextField(
                controller: _yearsController,
                label: 'Expected Lifespan of the Company (in years)',
                validator: (value) => value == null || value.isEmpty
                    ? 'Please enter lifespan'
                    : null,
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _calculateIntrinsicValue,
                child: const Text('Calculate Intrinsic Value'),
              ),
              const SizedBox(height: 20),
              if (_intrinsicValue != null)
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Intrinsic Value (20 Years): ${_intrinsicValue!.toStringAsFixed(2)} million Baht',
                      style: const TextStyle(
                          fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required String? Function(String?) validator,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: TextFormField(
        controller: controller,
        decoration: InputDecoration(labelText: label),
        keyboardType: TextInputType.number,
        validator: validator,
      ),
    );
  }
}
