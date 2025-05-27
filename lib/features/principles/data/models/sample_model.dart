class SampleModel {
  final String id;
  final String precedent;

  const SampleModel({required this.id, required this.precedent});

  factory SampleModel.fromJson(Map<String, dynamic> json) {
    return SampleModel(
      id: json['id'] as String,
      precedent: json['precedent'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'precedent': precedent
    };
  }
}