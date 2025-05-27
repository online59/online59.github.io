import 'package:flutter/material.dart';
import 'package:real_estate_helper/features/calculators/presentations/pages/intrinsic.dart';
import 'ccr_page.dart';
import 'checklist_page.dart';
import 'net_cash_flow_page.dart';
import 'monthly_payment_page.dart';
import 'purchase_price_page.dart';
import 'roi_page.dart';
import 'three_years_ncf_page.dart';

class CalculatorPage extends StatefulWidget {
  const CalculatorPage({super.key});

  @override
  _CalculatorPageState createState() => _CalculatorPageState();
}

class _CalculatorPageState extends State<CalculatorPage> {
  String _selectedCalculator = 'Purchase Price';

  final List<String> _calculators = [
    'Purchase Price',
    'Monthly Payment',
    'ROI Calculator',
    'CCR Calculator',
    'Net Cash Flow',
    'Three Years Net Cash Flow',
    'Intrinsict Calculator',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Real Estate Calculator'),
        backgroundColor: Colors.white,
        iconTheme: const IconThemeData(color: Color(0xFFFF4F09)),
        titleTextStyle: const TextStyle(color: Color(0xFFFF4F09), fontSize: 20),
      ),
      drawer: Drawer(
        backgroundColor: Colors.white,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      mainAxisSize: MainAxisSize.max,
                      children: [
                        Expanded(
                          child: DrawerHeader(
                            decoration: BoxDecoration(
                              color: Color(0xFFFF4F09),
                            ),
                            child: Text(
                              'Menu',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 24,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    ..._calculators.map((calculator) {
                      return ListTile(
                        title: Text(calculator),
                        textColor: Colors.black,
                        selectedColor: const Color(0xFFFF4F09),
                        selectedTileColor: const Color(0xFFFF4F09).withOpacity(0.1),
                        selected: _selectedCalculator == calculator,
                        onTap: () {
                          setState(() {
                            _selectedCalculator = calculator;
                          });
                          Navigator.pop(context); // Close the drawer
                        },
                      );
                    }),
                  ],
                ),
              ),
            ),
            ListTile(
              title: const Text('To Home Page'),
              textColor: Colors.black,
              selectedColor: const Color(0xFFFF4F09),
              selectedTileColor: const Color(0xFFFF4F09).withOpacity(0.1),
              onTap: () {
                Navigator.pop(context); // Close the drawer
                Navigator.pop(context); // Navigate back to the previous page
              },
            ),
          ],
        ),
      ),
      body: Row(
        children: [
          // Right Panel (Main Area)
          Expanded(
            child: Container(
              padding: const EdgeInsets.all(16.0),
              child: _buildCalculatorContent(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCalculatorContent() {
    switch (_selectedCalculator) {
      case 'Purchase Price':
        return const PurchasePriceCalculator();
      case 'Monthly Payment':
        return const MonthlyPaymentCalculator();
      case 'ROI Calculator':
        return const ROICalculator();
      case 'CCR Calculator':
        return const CCRCalculator();
      case 'Net Cash Flow':
        return const NetCashFlowCalculator();
      case 'Three Years Net Cash Flow':
        return const ThreeYearsNetCashFlowCalculator();
      case 'Checklist':
        return const ChecklistPage();
      case 'Intrinsict Calculator':
        return const IntrinsicValueCalculator();
      default:
        return const Center(child: Text('Select a calculator from the menu'));
    }
  }
}