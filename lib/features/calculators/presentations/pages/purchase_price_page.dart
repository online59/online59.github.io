import 'package:flutter/material.dart';
import 'package:real_estate_helper/features/calculators/presentations/widgets/custom_text_field.dart';

import '../../../../utils/percent_suffix.dart';
import '../../../../utils/thousand_separator.dart';

class PurchasePriceCalculator extends StatefulWidget {
  const PurchasePriceCalculator({super.key});

  @override
  State<PurchasePriceCalculator> createState() =>
      _PurchasePriceCalculatorState();
}

class _PurchasePriceCalculatorState extends State<PurchasePriceCalculator> {
  final TextEditingController _monthlyIncomeController =
      TextEditingController();
  final TextEditingController _yearlyCommonFacilitiesFeeController =
      TextEditingController();
  final TextEditingController _yearlySaleAgentFeeController =
      TextEditingController();
  final TextEditingController _monthlyOtherExpensesController =
      TextEditingController();
  final TextEditingController _yearlyOtherExpensesController =
      TextEditingController();
  final TextEditingController _expectedReturnRateController =
      TextEditingController();
  final formatter = ThousandsSeparatorInputFormatter();
  double _purchasePrice = 0;
  double _cashFlow = 0;

  void _calculatePurchasePrice() {
    setState(() {
      double monthlyIncome = _parseInput(_monthlyIncomeController.text);
      double yearlyCommonFacilitiesFee =
          _parseInput(_yearlyCommonFacilitiesFeeController.text);
      double yearlySaleAgentFee =
          _parseInput(_yearlySaleAgentFeeController.text);
      double monthlyOtherExpenses =
          _parseInput(_monthlyOtherExpensesController.text);
      double yearlyOtherExpenses =
          _parseInput(_yearlyOtherExpensesController.text);
      double expectedReturnRate =
          _parseInput(_expectedReturnRateController.text);

      if (expectedReturnRate != 0) {
        _purchasePrice = (((monthlyIncome - monthlyOtherExpenses) * 12) -
                yearlyCommonFacilitiesFee -
                yearlySaleAgentFee -
                yearlyOtherExpenses) /
            (expectedReturnRate / 100);
        _cashFlow = (((monthlyIncome - monthlyOtherExpenses) * 12) -
            yearlyCommonFacilitiesFee -
            yearlySaleAgentFee -
            yearlyOtherExpenses);
      } else {
        _purchasePrice = 0;
        _cashFlow = 0;
      }
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
            controller: _yearlyCommonFacilitiesFeeController,
            labelText: 'รายจ่ายค่าส่วนกลางต่อปี',
          ),
          CustomTextField(
            controller: _yearlySaleAgentFeeController,
            labelText: 'ค่านายหน้าหาผู้เช่า',
          ),
          CustomTextField(
            controller: _monthlyOtherExpensesController,
            labelText: 'ค่าใช้จ่ายรายเดือนอื่นๆ',
          ),
          CustomTextField(
            controller: _yearlyOtherExpensesController,
            labelText: 'ค่าใช้จ่ายรายปีอื่นๆ',
          ),
          CustomTextField(
            controller: _expectedReturnRateController,
            labelText: 'อัตราผลตอบแทนที่คาดหวังต่อปี (%)',
            inputFormatters: [PercentSuffixInputFormatter()],
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: _calculatePurchasePrice,
            child: const Text('คำนวณราคาซื้อ'),
          ),
          const SizedBox(height: 20),
          Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'ราคาซื้อ: ${formatter.format(_purchasePrice)}',
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                'กระแสเงินสด: ${formatter.format(_cashFlow)}',
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const Text(
                'กระแสเงินสดแสดงถึงจำนวนเงินที่สามารถใช้ชำระธนาคารได้ หากการชำระเงินเกินจำนวนนี้ควรพิจารณาไม่ซื้อทรัพย์สิน',
              ),
            ],
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _monthlyIncomeController.dispose();
    _yearlyCommonFacilitiesFeeController.dispose();
    _yearlySaleAgentFeeController.dispose();
    _monthlyOtherExpensesController.dispose();
    _yearlyOtherExpensesController.dispose();
    _expectedReturnRateController.dispose();
    super.dispose();
  }
}
