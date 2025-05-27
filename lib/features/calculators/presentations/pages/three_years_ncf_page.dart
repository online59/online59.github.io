import 'package:flutter/material.dart';
import 'package:real_estate_helper/features/calculators/presentations/widgets/custom_text_field.dart';
import '../../../../utils/thousand_separator.dart';

class ThreeYearsNetCashFlowCalculator extends StatefulWidget {
  const ThreeYearsNetCashFlowCalculator({super.key});

  @override
  _ThreeYearsNetCashFlowCalculatorState createState() =>
      _ThreeYearsNetCashFlowCalculatorState();
}

class _ThreeYearsNetCashFlowCalculatorState
    extends State<ThreeYearsNetCashFlowCalculator> {
  final TextEditingController _monthlyIncomeCtl1 = TextEditingController();
  final TextEditingController _monthlyPaymentCtl1 = TextEditingController();
  final TextEditingController _yearlyCommonFeeCtl1 = TextEditingController();
  final TextEditingController _yearlySaleAgentFeeCtl1 = TextEditingController();
  final TextEditingController _otherMonthlyExpensesCtl1 =
  TextEditingController();
  final TextEditingController _otherYearlyExpensesCtl1 =
  TextEditingController();

  final TextEditingController _monthlyIncomeCtl2 = TextEditingController();
  final TextEditingController _monthlyPaymentCtl2 = TextEditingController();
  final TextEditingController _yearlyCommonFeeCtl2 = TextEditingController();
  final TextEditingController _yearlySaleAgentFeeCtl2 = TextEditingController();
  final TextEditingController _otherMonthlyExpensesCtl2 =
  TextEditingController();
  final TextEditingController _otherYearlyExpensesCtl2 =
  TextEditingController();

  final TextEditingController _monthlyIncomeCtl3 = TextEditingController();
  final TextEditingController _monthlyPaymentCtl3 = TextEditingController();
  final TextEditingController _yearlyCommonFeeCtl3 = TextEditingController();
  final TextEditingController _yearlySaleAgentFeeCtl3 = TextEditingController();
  final TextEditingController _otherMonthlyExpensesCtl3 =
  TextEditingController();
  final TextEditingController _otherYearlyExpensesCtl3 =
  TextEditingController();

  final formatter = ThousandsSeparatorInputFormatter();
  double _monthlyCashFlow1 = 0;
  double _yearlyCashFlow1 = 0;

  double _monthlyCashFlow2 = 0;
  double _yearlyCashFlow2 = 0;

  double _monthlyCashFlow3 = 0;
  double _yearlyCashFlow3 = 0;

  void _calculateCashFlowYear1() {
    setState(() {
      double monthlyIncome = _parseInput(_monthlyIncomeCtl1.text);
      double monthlyPayment = _parseInput(_monthlyPaymentCtl1.text);
      double otherMonthlyExpenses = _parseInput(_otherMonthlyExpensesCtl1.text);
      double commonFee = _parseInput(_yearlyCommonFeeCtl1.text);
      double saleAgentFee = _parseInput(_yearlySaleAgentFeeCtl1.text);
      double otherYearlyExpenses = _parseInput(_otherYearlyExpensesCtl1.text);

      _monthlyCashFlow1 = monthlyIncome -
          monthlyPayment -
          otherMonthlyExpenses -
          ((commonFee + saleAgentFee + otherYearlyExpenses) / 12);
      _yearlyCashFlow1 = _monthlyCashFlow1 * 12;
    });
  }

  void _calculateCashFlowYear2() {
    setState(() {
      double monthlyIncome = _parseInput(_monthlyIncomeCtl2.text);
      double monthlyPayment = _parseInput(_monthlyPaymentCtl2.text);
      double otherMonthlyExpenses = _parseInput(_otherMonthlyExpensesCtl2.text);
      double commonFee = _parseInput(_yearlyCommonFeeCtl2.text);
      double saleAgentFee = _parseInput(_yearlySaleAgentFeeCtl2.text);
      double otherYearlyExpenses = _parseInput(_otherYearlyExpensesCtl2.text);

      _monthlyCashFlow2 = monthlyIncome -
          monthlyPayment -
          otherMonthlyExpenses -
          ((commonFee + saleAgentFee + otherYearlyExpenses) / 12);
      _yearlyCashFlow2 = _monthlyCashFlow2 * 12;
    });
  }

  void _calculateCashFlowYear3() {
    setState(() {
      double monthlyIncome = _parseInput(_monthlyIncomeCtl3.text);
      double monthlyPayment = _parseInput(_monthlyPaymentCtl3.text);
      double otherMonthlyExpenses = _parseInput(_otherMonthlyExpensesCtl3.text);
      double commonFee = _parseInput(_yearlyCommonFeeCtl3.text);
      double saleAgentFee = _parseInput(_yearlySaleAgentFeeCtl3.text);
      double otherYearlyExpenses = _parseInput(_otherYearlyExpensesCtl3.text);

      _monthlyCashFlow3 = monthlyIncome -
          monthlyPayment -
          otherMonthlyExpenses -
          ((commonFee + saleAgentFee + otherYearlyExpenses) / 12);
      _yearlyCashFlow3 = _monthlyCashFlow3 * 12;
    });
  }

  double _parseInput(String input) {
    return double.tryParse(input.replaceAll(',', '').replaceAll(' %', '')) ?? 0;
  }

  void _calculateAllCashFlows() {
    _calculateCashFlowYear1();
    _calculateCashFlowYear2();
    _calculateCashFlowYear3();
  }

  @override
  Widget build(BuildContext context) {
    double total3YearsIncome =
        _yearlyCashFlow1 + _yearlyCashFlow2 + _yearlyCashFlow3;
    double averageMonthlyCashFlow = (total3YearsIncome / 3) / 12;

    return SingleChildScrollView(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Year ONE',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              CustomTextField(
                controller: _monthlyIncomeCtl1,
                labelText: 'รายได้ค่าเช่าต่อเดือน',
              ),
              CustomTextField(
                controller: _monthlyPaymentCtl1,
                labelText: 'ค่างวดธนาคารต่อเดือน',
              ),
              CustomTextField(
                controller: _otherMonthlyExpensesCtl1,
                labelText: 'ค่าใช้จ่ายรายเดือนอื่นๆ',
              ),
              CustomTextField(
                controller: _yearlyCommonFeeCtl1,
                labelText: 'รายจ่ายค่าส่วนกลางต่อปี',
              ),
              CustomTextField(
                controller: _yearlySaleAgentFeeCtl1,
                labelText: 'ค่านายหน้าหาผู้เช่า',
              ),
              CustomTextField(
                controller: _otherYearlyExpensesCtl1,
                labelText: 'ค่าใช้จ่ายรายปีอื่นๆ',
              ),
              const SizedBox(height: 20),
            ],
          ),
          const SizedBox(height: 32),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Year TWO',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              CustomTextField(
                controller: _monthlyIncomeCtl2,
                labelText: 'รายได้ค่าเช่าต่อเดือน',
              ),
              CustomTextField(
                controller: _monthlyPaymentCtl2,
                labelText: 'ค่างวดธนาคารต่อเดือน',
              ),
              CustomTextField(
                controller: _otherMonthlyExpensesCtl2,
                labelText: 'ค่าใช้จ่ายรายเดือนอื่นๆ',
              ),
              CustomTextField(
                controller: _yearlyCommonFeeCtl2,
                labelText: 'รายจ่ายค่าส่วนกลางต่อปี',
              ),
              CustomTextField(
                controller: _yearlySaleAgentFeeCtl2,
                labelText: 'ค่านายหน้าหาผู้เช่า',
              ),
              CustomTextField(
                controller: _otherYearlyExpensesCtl2,
                labelText: 'ค่าใช้จ่ายรายปีอื่นๆ',
              ),
              const SizedBox(height: 20),
            ],
          ),
          const SizedBox(height: 32),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Year THREE',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              CustomTextField(
                controller: _monthlyIncomeCtl3,
                labelText: 'รายได้ค่าเช่าต่อเดือน',
              ),
              CustomTextField(
                controller: _monthlyPaymentCtl3,
                labelText: 'ค่างวดธนาคารต่อเดือน',
              ),
              CustomTextField(
                controller: _otherMonthlyExpensesCtl3,
                labelText: 'ค่าใช้จ่ายรายเดือนอื่นๆ',
              ),
              CustomTextField(
                controller: _yearlyCommonFeeCtl3,
                labelText: 'รายจ่ายค่าส่วนกลางต่อปี',
              ),
              CustomTextField(
                controller: _yearlySaleAgentFeeCtl3,
                labelText: 'ค่านายหน้าหาผู้เช่า',
              ),
              CustomTextField(
                controller: _otherYearlyExpensesCtl3,
                labelText: 'ค่าใช้จ่ายรายปีอื่นๆ',
              ),
              const SizedBox(height: 20),
            ],
          ),
          const SizedBox(height: 32),
          ElevatedButton(
              onPressed: _calculateAllCashFlows, child: const Text('Calculate All Cash Flows')),
          const SizedBox(height: 20),
          const Text('Year ONE', style: TextStyle(fontWeight: FontWeight.bold)),
          Text(
            'กระแสเงินสดรายเดือน Year 1: ${formatter.format(_monthlyCashFlow1)}',
          ),
          Text(
            'กระแสเงินสดรายปี Year 1: ${formatter.format(_yearlyCashFlow1)}',
          ),
          const Text('Year TWO', style: TextStyle(fontWeight: FontWeight.bold)),
          Text(
            'กระแสเงินสดรายเดือน Year 2: ${formatter.format(_monthlyCashFlow2)}',
          ),
          Text(
            'กระแสเงินสดรายปี Year 2: ${formatter.format(_yearlyCashFlow2)}',
          ),
          const Text('Year THREE', style: TextStyle(fontWeight: FontWeight.bold)),
          Text(
            'กระแสเงินสดรายเดือน Year 3: ${formatter.format(_monthlyCashFlow3)}',
          ),
          Text(
            'กระแสเงินสดรายปี Year 3: ${formatter.format(_yearlyCashFlow3)}',
          ),
          const SizedBox(height: 32),
          Text(
            'รวมกระแสเงินสด 3 ปี: ${formatter.format(total3YearsIncome)}',
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            'กระแสเงินสด 3 ปีเฉลี่ยต่อเดือน: ${formatter.format(averageMonthlyCashFlow)}',
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
    _monthlyIncomeCtl1.dispose();
    _monthlyPaymentCtl1.dispose();
    _yearlyCommonFeeCtl1.dispose();
    _yearlySaleAgentFeeCtl1.dispose();
    _otherYearlyExpensesCtl1.dispose();
    _otherMonthlyExpensesCtl1.dispose();

    _monthlyIncomeCtl2.dispose();
    _monthlyPaymentCtl2.dispose();
    _yearlyCommonFeeCtl2.dispose();
    _yearlySaleAgentFeeCtl2.dispose();
    _otherYearlyExpensesCtl2.dispose();
    _otherMonthlyExpensesCtl2.dispose();

    _monthlyIncomeCtl3.dispose();
    _monthlyPaymentCtl3.dispose();
    _yearlyCommonFeeCtl3.dispose();
    _yearlySaleAgentFeeCtl3.dispose();
    _otherYearlyExpensesCtl3.dispose();
    _otherMonthlyExpensesCtl3.dispose();

    super.dispose();
  }
}