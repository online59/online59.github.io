import 'package:firebase_database/firebase_database.dart';
import 'package:real_estate_helper/features/principles/data/models/sample_model.dart';

abstract class SampleRemoteDataSource {
  Future<List<SampleModel>> fetchSamples();
  Future<void> setSample(SampleModel sample);
  Future<void> updateSample(SampleModel sample);
  Future<void> deleteSample(SampleModel sample);
}

class SampleRemoteDataSourceImpl extends SampleRemoteDataSource {
  final DatabaseReference _sampleRef;

  SampleRemoteDataSourceImpl(this._sampleRef);

  @override
  Future<void> deleteSample(SampleModel sample) async {
    // Assumes sample.id is the key in the database
    await _sampleRef.child(sample.id).remove();
  }

  @override
  Future<List<SampleModel>> fetchSamples() async {
    final snapshot = await _sampleRef.once();
    if (snapshot.snapshot.value != null) {
      final data = snapshot.snapshot.value as Map<dynamic, dynamic>;
      return data.entries
          .map((entry) => SampleModel.fromJson(Map<String, dynamic>.from(entry.value)))
          .toList();
    }
    return [];
  }

  @override
  Future<void> setSample(SampleModel sample) async {
    // Use sample.id as the key
    await _sampleRef.child(sample.id).set(sample.toJson());
  }

  @override
  Future<void> updateSample(SampleModel sample) async {
    // Use sample.id as the key
    await _sampleRef.child(sample.id).update(sample.toJson());
  }
}