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

  final List<_CalculatorMenuItem> _calculators = [
    _CalculatorMenuItem(
      name: 'Purchase Price',
      icon: Icons.attach_money_rounded,
      color: Color(0xFF43A047), // green
    ),
    _CalculatorMenuItem(
      name: 'Monthly Payment',
      icon: Icons.calendar_month_rounded,
      color: Color(0xFF66BB6A), // green
    ),
    _CalculatorMenuItem(
      name: 'ROI Calculator',
      icon: Icons.trending_up_rounded,
      color: Color(0xFF388E3C), // green
    ),
    _CalculatorMenuItem(
      name: 'CCR Calculator',
      icon: Icons.percent_rounded,
      color: Color(0xFF2E7D32), // green
    ),
    _CalculatorMenuItem(
      name: 'Net Cash Flow',
      icon: Icons.swap_vert_circle_rounded,
      color: Color(0xFF81C784), // green
    ),
    _CalculatorMenuItem(
      name: 'Three Years Net Cash Flow',
      icon: Icons.timeline_rounded,
      color: Color(0xFF388E3C), // green
    ),
    _CalculatorMenuItem(
      name: 'Intrinsict Calculator',
      icon: Icons.stacked_line_chart_rounded,
      color: Color(0xFF43A047), // green
    ),
    _CalculatorMenuItem(
      name: 'Checklist',
      icon: Icons.checklist_rounded,
      color: Color(0xFF66BB6A), // green
    ),
  ];

  static const Color accentGreen = Color(0xFF43A047);

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width >= 800;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Real Estate Calculator'),
        backgroundColor: Colors.white,
        iconTheme: const IconThemeData(color: accentGreen),
        titleTextStyle: const TextStyle(
            color: accentGreen, fontSize: 20, fontWeight: FontWeight.bold),
        elevation: 1,
      ),
      drawer: isDesktop ? null : _buildDrawer(context),
      // Use a green gradient background with a Container, not backgroundColor
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFe8f5e9), Color(0xFFc8e6c9)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: Row(
          children: [
            if (isDesktop)
              _buildSideMenu(context),
            // Main Content
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.95),
                  borderRadius: isDesktop
                      ? const BorderRadius.only(
                    topLeft: Radius.circular(32),
                    bottomLeft: Radius.circular(32),
                  )
                      : null,
                  boxShadow: isDesktop
                      ? [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 24,
                      offset: Offset(-2, 0),
                    ),
                  ]
                      : null,
                ),
                margin: isDesktop ? const EdgeInsets.only(top: 18, bottom: 18, right: 18) : null,
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 18),
                child: _buildCalculatorContent(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Modern Side Menu for Desktop
  Widget _buildSideMenu(BuildContext context) {
    return Container(
      width: 250,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFFe8f5e9), Color(0xFFc8e6c9)],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 20,
            offset: Offset(2, 0),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Header
          const DrawerHeader(
            decoration: BoxDecoration(
              color: Color(0xFF43A047),
            ),
            child: Align(
              alignment: Alignment.bottomLeft,
              child: Text(
                'Calculator Menu',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
              ),
            ),
          ),
          // Menu Items
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                ..._calculators.map((calculator) {
                  final selected = _selectedCalculator == calculator.name;
                  return AnimatedContainer(
                    duration: const Duration(milliseconds: 180),
                    margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 12),
                    decoration: BoxDecoration(
                      color: selected ? const Color(0xFF43A047).withOpacity(0.15) : Colors.transparent,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: ListTile(
                      leading: Icon(
                        calculator.icon,
                        color: selected ? const Color(0xFF43A047) : calculator.color,
                        size: 28,
                      ),
                      title: Text(
                        calculator.name,
                        style: TextStyle(
                          color: selected ? const Color(0xFF43A047) : Colors.black87,
                          fontWeight: selected ? FontWeight.bold : FontWeight.normal,
                        ),
                      ),
                      selected: selected,
                      onTap: () {
                        setState(() {
                          _selectedCalculator = calculator.name;
                        });
                      },
                    ),
                  );
                }),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(10.0),
            child: OutlinedButton.icon(
              onPressed: () {
                Navigator.of(context).maybePop();
              },
              icon: const Icon(Icons.home_rounded, color: Color(0xFF43A047)),
              label: const Text("To Home Page", style: TextStyle(color: Color(0xFF43A047))),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Color(0xFF43A047)),
                padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 24),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
            ),
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }

  // Modern Drawer for Mobile/Tablet
  Drawer _buildDrawer(BuildContext context) {
    return Drawer(
      backgroundColor: Colors.white,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const DrawerHeader(
            decoration: BoxDecoration(
              color: Color(0xFF43A047),
            ),
            child: Align(
              alignment: Alignment.bottomLeft,
              child: Text(
                'Calculator Menu',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
              ),
            ),
          ),
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                ..._calculators.map((calculator) {
                  final selected = _selectedCalculator == calculator.name;
                  return AnimatedContainer(
                    duration: const Duration(milliseconds: 180),
                    margin: const EdgeInsets.symmetric(vertical: 2, horizontal: 10),
                    decoration: BoxDecoration(
                      color: selected ? const Color(0xFF43A047).withOpacity(0.13) : Colors.transparent,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: ListTile(
                      leading: Icon(
                        calculator.icon,
                        color: selected ? const Color(0xFF43A047) : calculator.color,
                        size: 28,
                      ),
                      title: Text(
                        calculator.name,
                        style: TextStyle(
                          color: selected ? const Color(0xFF43A047) : Colors.black87,
                          fontWeight: selected ? FontWeight.bold : FontWeight.normal,
                        ),
                      ),
                      selected: selected,
                      onTap: () {
                        setState(() {
                          _selectedCalculator = calculator.name;
                        });
                        Navigator.pop(context); // Close the drawer
                      },
                    ),
                  );
                }),
              ],
            ),
          ),
          ListTile(
            leading: const Icon(Icons.home_rounded, color: Color(0xFF43A047)),
            title: const Text('To Home Page', style: TextStyle(color: Color(0xFF43A047))),
            onTap: () {
              Navigator.pop(context); // Close the drawer
              Navigator.pop(context); // Navigate back to the previous page
            },
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

class _CalculatorMenuItem {
  final String name;
  final IconData icon;
  final Color color;

  const _CalculatorMenuItem({
    required this.name,
    required this.icon,
    required this.color,
  });
}