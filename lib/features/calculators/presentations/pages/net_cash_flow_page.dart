import 'package:flutter/material.dart';
import 'package:real_estate_helper/features/calculators/presentations/widgets/custom_text_field.dart';

import '../../../../utils/thousand_separator.dart';

class NetCashFlowCalculator extends StatefulWidget {
  const NetCashFlowCalculator({super.key});

  @override
  _NetCashFlowCalculatorState createState() => _NetCashFlowCalculatorState();
}

class _NetCashFlowCalculatorState extends State<NetCashFlowCalculator> {
  final TextEditingController _monthlyIncomeController = TextEditingController();
  final TextEditingController _monthlyPaymentController = TextEditingController();
  final TextEditingController _yearlyCommonFeeController = TextEditingController();
  final TextEditingController _yearlySaleAgentFeeController = TextEditingController();
  final TextEditingController _otherMonthlyExpensesController = TextEditingController();
  final TextEditingController _otherYearlyExpensesController = TextEditingController();
  final formatter = ThousandsSeparatorInputFormatter();
  double _monthlyCashFlow = 0;
  double _yearlyCashFlow = 0;

  void _calculateCashFlow() {
    setState(() {
      double monthlyIncome = _parseInput(_monthlyIncomeController.text);
      double monthlyPayment = _parseInput(_monthlyPaymentController.text);
      double commonFee = _parseInput(_yearlyCommonFeeController.text);
      double saleAgentFee = _parseInput(_yearlySaleAgentFeeController.text);
      double otherYearlyExpenses = _parseInput(_otherMonthlyExpensesController.text);
      double otherMonthlyExpenses = _parseInput(_otherYearlyExpensesController.text);

      _monthlyCashFlow = monthlyIncome - monthlyPayment - otherMonthlyExpenses - ((commonFee + saleAgentFee) / 12) - otherYearlyExpenses;
      _yearlyCashFlow = _monthlyCashFlow * 12;
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
            controller: _otherMonthlyExpensesController,
            labelText: 'ค่าใช้จ่ายรายเดือนอื่นๆ',
          ),
          CustomTextField(
            controller: _yearlyCommonFeeController,
            labelText: 'รายจ่ายค่าส่วนกลางต่อปี',
          ),
          CustomTextField(
            controller: _yearlySaleAgentFeeController,
            labelText: 'ค่านายหน้าหาผู้เช่า',
          ),
          CustomTextField(
            controller: _otherYearlyExpensesController,
            labelText: 'ค่าใช้จ่ายรายปีอื่นๆ',
          ),
          const SizedBox(height: 20),
          ElevatedButton(
              onPressed: _calculateCashFlow, child: const Text('Calculate Cash Flow')),
          const SizedBox(height: 20),
          Text(
            'Monthly Cash Flow: ${formatter.format(_monthlyCashFlow)}',
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            'Yearly Cash Flow: ${formatter.format(_yearlyCashFlow)}',
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
    _monthlyPaymentController.dispose();
    _yearlyCommonFeeController.dispose();
    _yearlySaleAgentFeeController.dispose();
    _otherYearlyExpensesController.dispose();
    _otherMonthlyExpensesController.dispose();
    super.dispose();
  }
}