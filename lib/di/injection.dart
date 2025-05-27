import 'package:get_it/get_it.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:real_estate_helper/features/principle_group/data/datasources/group_remote_datasource.dart';
import 'package:real_estate_helper/features/principle_group/data/repositories/group_repository_impl.dart';
import 'package:real_estate_helper/features/principle_group/domain/repositories/group_repository.dart';
import 'package:real_estate_helper/features/principle_group/domain/usecases/add_group.dart';
import 'package:real_estate_helper/features/principle_group/domain/usecases/delete_group.dart';
import 'package:real_estate_helper/features/principle_group/domain/usecases/fetch_groups.dart';
import 'package:real_estate_helper/features/principle_group/domain/usecases/update_group.dart';
import 'package:real_estate_helper/features/principle_group/presentations/bloc/group_bloc.dart';
import 'package:real_estate_helper/features/principles/data/datasources/principle_remote_datasource.dart';
import 'package:real_estate_helper/features/principles/data/repositories/principle_repository_impl.dart';
import 'package:real_estate_helper/features/principles/domain/repositories/principle_repository.dart';
import 'package:real_estate_helper/features/principles/domain/usecases/add_principle.dart';
import 'package:real_estate_helper/features/principles/domain/usecases/delete_principle.dart';
import 'package:real_estate_helper/features/principles/domain/usecases/fetch_principles.dart';
import 'package:real_estate_helper/features/principles/domain/usecases/update_principle.dart';
import 'package:real_estate_helper/features/principles/presentations/bloc/principle_bloc.dart';

final sl = GetIt.instance;

void init() {
  // Firebase Database Reference
  sl.registerLazySingleton<DatabaseReference>(
        () => FirebaseDatabase.instance.ref('groups'),
    instanceName: 'groupsRef',
  );

  // Data sources
  sl.registerLazySingleton<GroupRemoteDataSource>(
          () => GroupRemoteDataSourceImpl(sl<DatabaseReference>(instanceName: 'groupsRef')));

  // Repository
  sl.registerLazySingleton<GroupRepository>(() => GroupRepositoryImpl(sl()));

  // Usecases
  sl.registerLazySingleton<FetchGroups>(() => FetchGroups(sl()));
  sl.registerLazySingleton<AddGroup>(() => AddGroup(sl()));
  sl.registerLazySingleton<UpdateGroup>(() => UpdateGroup(sl()));
  sl.registerLazySingleton<DeleteGroup>(() => DeleteGroup(sl()));

  // Bloc
  sl.registerFactory(() => GroupBloc(
        fetchGroups: sl(),
        addGroup: sl(),
        updateGroup: sl(),
        deleteGroup: sl(),
      ));

  // Firebase Database Reference (adjust the path as needed)
  sl.registerLazySingleton<DatabaseReference>(
        () => FirebaseDatabase.instance.ref('principles'),
    instanceName: 'principlesRef',
  );

  // Data sources
  sl.registerLazySingleton<PrincipleRemoteDataSource>(
          () => PrincipleRemoteDataSourceImpl(sl<DatabaseReference>(instanceName: 'principlesRef')));

  // Repository
  sl.registerLazySingleton<PrincipleRepository>(() => PrincipleRepositoryImpl(sl()));

  // Usecases
  sl.registerLazySingleton(() => AddPrinciple(sl()));
  sl.registerLazySingleton(() => FetchPrinciples(sl()));
  sl.registerLazySingleton(() => UpdatePrinciple(sl()));
  sl.registerLazySingleton(() => DeletePrinciple(sl()));

  // Bloc
  sl.registerFactory(() => PrincipleBloc(
    fetchPrinciples: sl(),
    addPrinciple: sl(),
    updatePrinciple: sl(),
    deletePrinciple: sl(),
  ));
}
