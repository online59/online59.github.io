import 'package:real_estate_helper/features/principle_group/domain/entities/group.dart';
import 'package:real_estate_helper/features/principle_group/domain/repositories/group_repository.dart';

class FetchGroups {
  final GroupRepository repository;

  FetchGroups(this.repository);

  Future<List<Group>> call() async {
    return await repository.fetchGroups();
  }
}