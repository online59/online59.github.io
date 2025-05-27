import 'package:flutter/material.dart';
import 'package:real_estate_helper/features/calculators/presentations/widgets/custom_text_field.dart';

class CCRCalculator extends StatefulWidget {
  const CCRCalculator({super.key});

  @override
  _CCRCalculatorState createState() => _CCRCalculatorState();
}

class _CCRCalculatorState extends State<CCRCalculator> {
  final TextEditingController _monthlyIncomeController =
      TextEditingController();
  final TextEditingController _commonFeeController = TextEditingController();
  final TextEditingController _agentFeeController = TextEditingController();
  final TextEditingController _reserveFeeController = TextEditingController();
  final TextEditingController _mortgageFeeController = TextEditingController();
  final TextEditingController _downPaymentController = TextEditingController();
  final TextEditingController _otherCostsController = TextEditingController();
  final TextEditingController _monthlyPaymentController =
      TextEditingController();
  double _ccr = 0;

  void _calculateCCR() {
    setState(() {
      double monthlyIncome = _parseInput(_monthlyIncomeController.text);
      double commonFee = _parseInput(_commonFeeController.text);
      double agentFee = _parseInput(_agentFeeController.text);
      double reserveFee = _parseInput(_reserveFeeController.text);
      double mortgageFee = _parseInput(_mortgageFeeController.text);
      double downPayment = _parseInput(_downPaymentController.text);
      double otherCosts = _parseInput(_otherCostsController.text);
      double monthlyPayment = _parseInput(_monthlyPaymentController.text);

      double yearlyIncome = monthlyIncome * 12;

      _ccr = (yearlyIncome - commonFee - agentFee - (monthlyPayment * 12)) /
          (reserveFee + mortgageFee + downPayment + otherCosts);
    });
  }

  double _parseInput(String input) {
    return double.tryParse(input.replaceAll(',', '').replaceAll(' %', '')) ?? 0;
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CustomTextField(
            controller: _monthlyIncomeController,
            labelText: 'รายได้ค่าเช่าต่อเดือน',
          ),
          CustomTextField(
            controller: _monthlyPaymentController,
            labelText: 'ค่างวดธนาคารต่อเดือน',
          ),
          CustomTextField(
            controller: _commonFeeController,
            labelText: 'รายจ่ายค่าส่วนกลางต่อปี',
          ),
          CustomTextField(
            controller: _agentFeeController,
            labelText: 'ค่านายหน้าหาผู้เช่า',
          ),
          CustomTextField(
            controller: _reserveFeeController,
            labelText: 'ค่าจองสัญญาซื้อห้อง',
          ),
          CustomTextField(
            controller: _mortgageFeeController,
            labelText: 'ค่าธรรมเนียมจดจำนอง',
          ),
          CustomTextField(
            controller: _downPaymentController,
            labelText: 'เงินดาวน์ที่ต้องจ่าย',
          ),
          CustomTextField(
            controller: _otherCostsController,
            labelText: 'ค่าใช้จ่ายอื่นๆ',
          ),
          const SizedBox(height: 20),
          ElevatedButton(
              onPressed: _calculateCCR, child: const Text('Calculate CCR')),
          const SizedBox(height: 20),
          Text(
            'Cash on Cash Return: ${_ccr.toStringAsFixed(2)}',
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _monthlyIncomeController.dispose();
    _commonFeeController.dispose();
    _agentFeeController.dispose();
    _reserveFeeController.dispose();
    _mortgageFeeController.dispose();
    _downPaymentController.dispose();
    _otherCostsController.dispose();
    _monthlyPaymentController.dispose();
    super.dispose();
  }
}
