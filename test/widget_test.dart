import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:real_estate_helper/features/calculators/presentations/pages/purchase_price_page.dart';

void main() {
  testWidgets('PurchasePriceCalculator calculates purchase price correctly', (WidgetTester tester) async {
    // Build the widgets
    await tester.pumpWidget(const MaterialApp(home: PurchasePriceCalculator()));

    // Find the text fields and button
    final monthlyIncomeField = find.byType(TextField).at(0);
    final expectedReturnRateField = find.byType(TextField).at(1);
    final calculateButton = find.byType(ElevatedButton);

    // Enter values into the text fields
    await tester.enterText(monthlyIncomeField, '5000');
    await tester.enterText(expectedReturnRateField, '5');

    // Tap the calculate button
    await tester.tap(calculateButton);

    // Rebuild the widgets after the state has changed
    await tester.pump();

    // Verify the calculated purchase price
    expect(find.text('Purchase Price: 1200000.00'), findsOneWidget);
  });
}