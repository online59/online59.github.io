import 'package:flutter/material.dart';
import 'package:real_estate_helper/features/home/presentations/pages/home_page.dart';

// This is the passcode you want to require.
// In production, store this securely and don't hardcode!
const String presetPasscode = '2468';

class PasscodePage extends StatefulWidget {
  const PasscodePage({super.key});

  @override
  State<PasscodePage> createState() => _PasscodePageState();
}

class _PasscodePageState extends State<PasscodePage> {
  final TextEditingController _passcodeController = TextEditingController();
  String? _errorText;
  bool _obscure = true;
  bool _isLoading = false;

  void _validateAndGoHome() async {
    setState(() {
      _isLoading = true;
      _errorText = null;
    });

    await Future.delayed(const Duration(milliseconds: 700));

    if (_passcodeController.text == presetPasscode) {
      // Replace this with your navigation to HomePage
      if (!mounted) return;
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const HomePage()),
      );
    } else {
      setState(() {
        _errorText = "Incorrect passcode. Please try again.";
        _isLoading = false;
      });
    }
  }

  Widget _buildPasscodeTextField() {
    return TextField(
      controller: _passcodeController,
      obscureText: _obscure,
      textAlign: TextAlign.center,
      keyboardType: TextInputType.number,
      style: const TextStyle(
        letterSpacing: 16,
        fontSize: 28,
        fontWeight: FontWeight.bold,
        color: Color(0xFF388E3C),
      ),
      decoration: InputDecoration(
        hintText: '••••',
        hintStyle: const TextStyle(
          letterSpacing: 16,
          fontSize: 28,
          color: Colors.greenAccent,
        ),
        errorText: _errorText,
        filled: true,
        fillColor: Colors.white,
        contentPadding:
            const EdgeInsets.symmetric(vertical: 18, horizontal: 18),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: Color(0xFF43A047)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(
            color: Color(0xFF43A047),
            width: 2,
          ),
        ),
        suffixIcon: IconButton(
          icon: Icon(_obscure ? Icons.visibility_off : Icons.visibility,
              color: const Color(0xFF43A047)),
          onPressed: () => setState(() => _obscure = !_obscure),
        ),
      ),
      maxLength: 4,
      onSubmitted: (_) => _validateAndGoHome(),
      enabled: !_isLoading,
    );
  }

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    final isSmallScreen = width < 400;
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFe8f5e9), Color(0xFFc8e6c9)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            padding: EdgeInsets.symmetric(
                horizontal: isSmallScreen ? 24 : 44, vertical: 32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.lock, size: 64, color: Color(0xFF43A047)),
                const SizedBox(height: 30),
                Text(
                  "Enter Passcode",
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: const Color(0xFF388E3C),
                      ),
                ),
                const SizedBox(height: 8),
                Text(
                  "For your security, please enter your 4-digit passcode to continue.",
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Colors.green.shade800,
                      ),
                ),
                const SizedBox(height: 34),
                _buildPasscodeTextField(),
                const SizedBox(height: 28),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    icon: _isLoading
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          )
                        : const Icon(Icons.arrow_forward_rounded,
                            color: Colors.white),
                    label: Text(
                      _isLoading ? "Checking..." : "Unlock",
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                        color: Colors.white,
                        letterSpacing: 1.1,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF43A047),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16)),
                    ),
                    onPressed: _isLoading ? null : _validateAndGoHome,
                  ),
                ),
                const SizedBox(height: 38),
                Text(
                  "Powered by Ittipon Online59",
                  style: TextStyle(
                    color: Colors.green.shade900.withOpacity(0.48),
                    fontWeight: FontWeight.w500,
                    letterSpacing: 1.2,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
