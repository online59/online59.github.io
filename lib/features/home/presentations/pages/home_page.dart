import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:real_estate_helper/di/injection.dart';
import 'package:real_estate_helper/features/ledger/presentation/pages/ledger_page.dart';
import 'package:real_estate_helper/features/calculators/presentations/pages/calculator_page.dart';
import 'package:real_estate_helper/features/principle_group/presentations/bloc/group_bloc.dart';
import 'package:real_estate_helper/features/principle_group/presentations/pages/group_page.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);
    final isSmallScreen = mediaQuery.size.width < 400;

    return Scaffold(
      // Remove backgroundColor and use a gradient in the body instead
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Color(0xFFe0eafc),
              Color(0xFFcfdef3),
            ],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: EdgeInsets.symmetric(
              horizontal: isSmallScreen ? 10 : 30,
              vertical: isSmallScreen ? 18 : 36,
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Profile Section
                const SizedBox(height: 20),
                const CircleAvatar(
                  radius: 48,
                  backgroundImage: NetworkImage(
                    'https://cdn-icons-png.flaticon.com/512/7084/7084424.png', // <-- Replace with your image!
                  ),
                  backgroundColor: Colors.white,
                ),
                const SizedBox(height: 16),
                Text(
                  "Ittipon Online59",
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 6),
                Text(
                  "Flutter Developer • Real Estate Enthusiast",
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    color: Colors.black54,
                    fontWeight: FontWeight.w400,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 32),
                // Showcase Cards
                ShowcaseCard(
                  icon: Icons.menu_book_rounded,
                  title: 'Principle',
                  description: "View Ittipon's Principle",
                  onTap: () {
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
                const SizedBox(height: 18),
                ShowcaseCard(
                  icon: Icons.calculate_rounded,
                  title: 'Calculators',
                  description: 'Real Estate Calculators For Investors',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const CalculatorPage()),
                    );
                  },
                ),
                const SizedBox(height: 18),
                ShowcaseCard(
                  icon: Icons.account_balance_wallet_rounded,
                  title: 'Budget Ledger',
                  description: 'Welcome to the Money Tracker App!',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const BudgetLedgerPage()),
                    );
                  },
                ),
                const SizedBox(height: 40),
                // Footer
                Text(
                  "© ${DateTime.now().year} Ittipon Online59",
                  style: const TextStyle(
                    color: Colors.black38,
                    fontSize: 13,
                    letterSpacing: 1.1,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class ShowcaseCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;
  final VoidCallback onTap;

  const ShowcaseCard({
    required this.icon,
    required this.title,
    required this.description,
    required this.onTap,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 170),
        curve: Curves.easeInOut,
        padding: const EdgeInsets.all(22),
        decoration: BoxDecoration(
          color: isDark ? Colors.white10 : Colors.white.withOpacity(0.85),
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.13),
              blurRadius: 24,
              offset: const Offset(0, 7),
            ),
          ],
          border: Border.all(
            color: isDark
                ? Colors.white24
                : Colors.grey.withOpacity(0.18),
            width: 1.2,
          ),
        ),
        child: Row(
          children: [
            Container(
              decoration: BoxDecoration(
                color: Theme.of(context).primaryColor.withOpacity(0.09),
                borderRadius: BorderRadius.circular(16),
              ),
              padding: const EdgeInsets.all(14),
              child: Icon(
                icon,
                size: 36,
                color: Theme.of(context).primaryColor,
              ),
            ),
            const SizedBox(width: 22),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    description,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Colors.black54,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios_rounded, color: Colors.black26, size: 20),
          ],
        ),
      ),
    );
  }
}