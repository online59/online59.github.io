import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:real_estate_helper/di/injection.dart';
import 'package:real_estate_helper/features/ledger/presentation/pages/ledger_page.dart';
import 'package:real_estate_helper/features/calculators/presentations/pages/calculator_page.dart';
import 'package:real_estate_helper/features/home/presentations/widgets/custom_button.dart';
import 'package:real_estate_helper/features/principle_group/presentations/bloc/group_bloc.dart';
import 'package:real_estate_helper/features/principle_group/presentations/pages/group_page.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    // Get screen size for responsive padding and spacing
    final mediaQuery = MediaQuery.of(context);
    final isSmallScreen = mediaQuery.size.width < 400;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Home Page'),
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: EdgeInsets.symmetric(
              horizontal: isSmallScreen ? 10 : 30,
              vertical: isSmallScreen ? 18 : 36,
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                CustomButton(
                  title: 'Principle',
                  description: "View Ittipon's Principle",
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => BlocProvider(
                          create: (_) => sl<GroupBloc>()..add(FetchGroupsEvent()),
                          child: const GroupPage(),
                        ),
                      ),
                    );
                  },
                ),
                SizedBox(height: isSmallScreen ? 10 : 16),
                CustomButton(
                  title: 'Calculators',
                  description: 'Real Estate Calculators For Investor',
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const CalculatorPage()),
                    );
                  },
                ),
                SizedBox(height: isSmallScreen ? 10 : 16),
                CustomButton(
                  title: 'Budget Ledger',
                  description: 'Welcome to the Money Tracker App!',
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const BudgetLedgerPage()),
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}