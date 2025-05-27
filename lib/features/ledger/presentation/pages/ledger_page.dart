import 'package:flutter/material.dart';
import 'package:real_estate_helper/features/ledger/presentation/pages/ledger_home_page.dart';

class BudgetLedgerPage extends StatefulWidget {
  const BudgetLedgerPage({super.key});

  @override
  _BudgetLedgerPageState createState() => _BudgetLedgerPageState();
}

class _BudgetLedgerPageState extends State<BudgetLedgerPage> {
  int _selectedIndex = 0;

  static const List<Widget> _pages = <Widget>[
    Center(child: LedgerHomePage()),
    Center(child: Text('Wallet Page')),
    Center(child: Text('Budget Page')),
    Center(child: Text('More Page')),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  bool isLargeScreen(BuildContext context) {
    return MediaQuery.of(context).size.width > 600;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFFFF4F09),
        title: const Text('Budget Ledger'),
        centerTitle: true,
        leading: isLargeScreen(context)
            ? IconButton(
                icon: const Icon(Icons.menu),
                onPressed: () {
                  // Handle drawer menu action
                },
              )
            : null,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () {
              // Handle notification action
            },
          ),
        ],
      ),
      drawer: isLargeScreen(context)
          ? Drawer(
              child: ListView(
                padding: EdgeInsets.zero,
                children: <Widget>[
                  const DrawerHeader(
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
                  ListTile(
                    leading: const Icon(Icons.book),
                    title: const Text('Books'),
                    onTap: () => _onItemTapped(0),
                  ),
                  ListTile(
                    leading: const Icon(Icons.account_balance_wallet),
                    title: const Text('Wallet'),
                    onTap: () => _onItemTapped(1),
                  ),
                  ListTile(
                    leading: const Icon(Icons.pie_chart),
                    title: const Text('Budget'),
                    onTap: () => _onItemTapped(2),
                  ),
                  ListTile(
                    leading: const Icon(Icons.settings),
                    title: const Text('Setting'),
                    onTap: () => _onItemTapped(3),
                  ),
                ],
              ),
            )
          : null,
      body: _pages[_selectedIndex],
      bottomNavigationBar: isLargeScreen(context)
          ? null
          : BottomAppBar(
              height: kBottomNavigationBarHeight,
              notchMargin: 6.0,
              elevation: 8.0,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: <Widget>[
                  IconButton(
                    icon: const Icon(Icons.book),
                    onPressed: () => _onItemTapped(0),
                  ),
                  IconButton(
                    icon: const Icon(Icons.account_balance_wallet),
                    onPressed: () => _onItemTapped(1),
                  ),
                  const SizedBox(width: 40),
                  IconButton(
                    icon: const Icon(Icons.pie_chart),
                    onPressed: () => _onItemTapped(2),
                  ),
                  IconButton(
                    icon: const Icon(Icons.more_horiz),
                    onPressed: () => _onItemTapped(3),
                  ),
                ],
              ),
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Handle FAB action
        },
        child: const Icon(Icons.add, color: Colors.white),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
    );
  }
}
