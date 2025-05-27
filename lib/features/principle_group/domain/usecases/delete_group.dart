import 'package:real_estate_helper/features/principle_group/domain/repositories/group_repository.dart';

class DeleteGroup {
  final GroupRepository repository;

  DeleteGroup(this.repository);

  Future<void> call(String id) async {
    await repository.deleteGroup(id);
  }
}