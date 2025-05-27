import 'dart:math';

import 'package:flutter/material.dart';
import 'package:real_estate_helper/features/calculators/presentations/widgets/custom_text_field.dart';

import '../../../../utils/percent_suffix.dart';
import '../../../../utils/thousand_separator.dart';

class MonthlyPaymentCalculator extends StatefulWidget {
  const MonthlyPaymentCalculator({super.key});

  @override
  _MonthlyPaymentCalculatorState createState() =>
      _MonthlyPaymentCalculatorState();
}

class _MonthlyPaymentCalculatorState extends State<MonthlyPaymentCalculator>
    with AutomaticKeepAliveClientMixin {
  // Controllers to hold the state for inputs
  final TextEditingController _loanAmountController = TextEditingController();
  final TextEditingController _termController = TextEditingController();
  final TextEditingController _year1RateController = TextEditingController();
  final TextEditingController _year2RateController = TextEditingController();
  final TextEditingController _year3RateController = TextEditingController();
  final TextEditingController _mrrRateController = TextEditingController();
  final TextEditingController _mrrAdjustmentController =
      TextEditingController();

  // To store the payment schedule
  final List<Map<String, dynamic>> _paymentSchedule = [];

  double paymentFirstYear = 0;
  double paymentSecondYear = 0;
  double paymentThirdYear = 0;
  double paymentFourthYearPlus = 0;

  // Calculation method (remains the same)
  void _calculateMonthlyPayment() {
    double loanAmount = _parseInput(_loanAmountController.text);
    int term = int.tryParse(_termController.text) ?? 0;
    double year1Rate = _parseInput(_year1RateController.text);
    double year2Rate = _parseInput(_year2RateController.text);
    double year3Rate = _parseInput(_year3RateController.text);
    double mrrRate = _parseInput(_mrrRateController.text);
    double mrrAdjustment = _parseInput(_mrrAdjustmentController.text);

    _paymentSchedule.clear();
    paymentFirstYear = 0;
    paymentSecondYear = 0;
    paymentThirdYear = 0;
    paymentFourthYearPlus = 0;

    int totalPayments = term * 12;
    double currentLoanAmount = loanAmount;
    double accumulatedPayment = 0;
    double accumulatedInterest = 0;

    double calculateMonthlyPayment(
        double loanAmount, double annualRate, int termMonths) {
      double monthlyRate = annualRate / 100 / 12;
      return loanAmount *
          (monthlyRate * pow(1 + monthlyRate, termMonths)) /
          (pow(1 + monthlyRate, termMonths) - 1);
    }

    for (int month = 1; month <= totalPayments; month++) {
      double currentRate;
      int currentYear = (month / 12).ceil();

      if (month <= 12) {
        currentRate = year1Rate;
      } else if (month <= 24) {
        currentRate = year2Rate;
      } else if (month <= 36) {
        currentRate = year3Rate;
      } else {
        currentRate = mrrRate + mrrAdjustment;
      }

      double monthlyPayment = calculateMonthlyPayment(
          currentLoanAmount, currentRate, totalPayments - month + 1);
      double interestPaid = currentLoanAmount * (currentRate / 100 / 12);
      double principalPaid = monthlyPayment - interestPaid;
      accumulatedPayment += monthlyPayment;
      accumulatedInterest += interestPaid;

      if (month == 12 || month == 24 || month == 36 || month == 48) {
        if (currentYear == 1) {
          paymentFirstYear = monthlyPayment;
        } else if (currentYear == 2) {
          paymentSecondYear = monthlyPayment;
        } else if (currentYear == 3) {
          paymentThirdYear = monthlyPayment;
        } else if (currentYear == 4) {
          paymentFourthYearPlus = monthlyPayment;
        }
      }

      _paymentSchedule.add({
        'year': currentYear,
        'month': month % 12 == 0 ? 12 : month % 12,
        'payment': monthlyPayment,
        'interestPaid': interestPaid,
        'accumulatedPayment': accumulatedPayment,
        'accumulatedInterest': accumulatedInterest,
      });

      currentLoanAmount -= principalPaid;
    }

    // Call updateKeepAlive after state changes
    updateKeepAlive();
    setState(() {});
  }

  double _parseInput(String input) {
    return double.tryParse(input.replaceAll(',', '').replaceAll(' %', '')) ?? 0;
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    final ThousandsSeparatorInputFormatter formatter =
        ThousandsSeparatorInputFormatter();
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CustomTextField(
                controller: _loanAmountController,
                labelText: 'จำนวนเงินกู้',
              ),
              CustomTextField(
                controller: _termController,
                labelText: 'ระยะเวลากู้ (ปี)',
                keyboardType: TextInputType.number,
              ),
              CustomTextField(
                controller: _year1RateController,
                labelText: 'อัตราดอกเบี้ยปีที่ 1',
                inputFormatters: [PercentSuffixInputFormatter()],
              ),
              CustomTextField(
                controller: _year2RateController,
                labelText: 'อัตราดอกเบี้ยปีที่ 2',
                inputFormatters: [PercentSuffixInputFormatter()],
              ),
              CustomTextField(
                controller: _year3RateController,
                labelText: 'อัตราดอกเบี้ยปีที่ 3',
                inputFormatters: [PercentSuffixInputFormatter()],
              ),
              CustomTextField(
                controller: _mrrRateController,
                labelText: 'อัตราดอกเบี้ย MRR',
                inputFormatters: [PercentSuffixInputFormatter()],
              ),
              CustomTextField(
                controller: _mrrAdjustmentController,
                labelText: 'การปรับอัตราดอกเบี้ย MRR',
                inputFormatters: [PercentSuffixInputFormatter()],
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _calculateMonthlyPayment,
                child: const Text('คำนวนค่างวดต่อเดือน'),
              ),
            ],
          ),
          const SizedBox(height: 20),
          _paymentSchedule.isNotEmpty
              ? Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Column(
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                            'การชำระเงินรายเดือนปีที่ 1: ${formatter.format(paymentFirstYear)}'),
                        Text(
                            'การชำระเงินรายเดือนปีที่ 2: ${formatter.format(paymentSecondYear)}'),
                        Text(
                            'การชำระเงินรายเดือนปีที่ 3: ${formatter.format(paymentThirdYear)}'),
                        Text(
                            'การชำระเงินรายเดือนปีที่ 4+: ${formatter.format(paymentFourthYearPlus)}'),
                      ],
                    ),
                    _buildYearlyTable(1, _paymentSchedule.length),
                  ],
                )
              : Container(),
        ],
      ),
    );
  }

  Widget _buildYearlyTable(int startMonth, int endMonth) {
    final ThousandsSeparatorInputFormatter formatter =
        ThousandsSeparatorInputFormatter();
    List<Map<String, dynamic>> filteredSchedule = _paymentSchedule
        .where((payment) =>
            payment['month'] >= startMonth && payment['month'] <= endMonth)
        .toList();

    double totalPaymentPaid =
        filteredSchedule.fold(0, (sum, payment) => sum + payment['payment']);
    double totalInterestPaid = filteredSchedule.fold(
        0, (sum, payment) => sum + payment['interestPaid']);

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10.0),
      child: Column(
        children: [
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: DataTable(
              columns: const [
                DataColumn(label: Text('ปี')),
                DataColumn(label: Text('เดือน')),
                DataColumn(label: Text('ค่างวด')),
                DataColumn(label: Text('ดอกเบี้ยจ่าย')),
                DataColumn(label: Text('ค่างวดจ่ายสะสม')),
                DataColumn(label: Text('ดอกเบี้ยจ่ายสะสม')),
              ],
              rows: filteredSchedule.map((payment) {
                return DataRow(cells: [
                  DataCell(Text(payment['year'].toString())),
                  DataCell(Text(payment['month'].toString())),
                  DataCell(Text(formatter.format(payment['payment']))),
                  DataCell(Text(formatter.format(payment['interestPaid']))),
                  DataCell(Text(formatter.format(payment['accumulatedPayment']))),
                  DataCell(
                      Text(formatter.format(payment['accumulatedInterest']))),
                ]);
              }).toList(),
            ),
          ),
          // Display totals
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                    'รวมค่างวดทั้งหมด: ${formatter.format(totalPaymentPaid)}'),
                Text(
                    'รวมดอกเบี้ยจ่ายทั้งหมด: ${formatter.format(totalInterestPaid)}'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  bool get wantKeepAlive => true;

  @override
  void dispose() {
    // Dispose controllers
    _loanAmountController.dispose();
    _termController.dispose();
    _year1RateController.dispose();
    _year2RateController.dispose();
    _year3RateController.dispose();
    _mrrRateController.dispose();
    _mrrAdjustmentController.dispose();
    super.dispose();
  }
}
