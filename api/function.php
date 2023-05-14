<?php
  function getClients ($conn){

    $sql = "SELECT * FROM Client";
    $result = $conn->query($sql);

    $infolist = [];

    while($row = $result->fetch_assoc()) {
        $infolist[] = $row;
    }

    echo json_encode($infolist);
  }

  function getSortClient ($conn, $id, $id2){
    $sql = "SELECT * FROM Client WHERE id BETWEEN '$id' AND '$id2'";
    $result = $conn->query($sql);

    $infolist = [];

    while($row = $result->fetch_assoc()) {
        $infolist[] = $row;
    }

    echo json_encode($infolist);
  }

  function getClient($conn, $id){
    $sql = "SELECT * FROM Client WHERE id = '$id'";
    $result = $conn->query($sql);
    $sql = "SELECT * FROM Contract WHERE client_id = '$id'";
    $res = $conn->query($sql);

    $infolist = [];

    while($row = $result->fetch_assoc()) {
        $infolist[] = $row;
    }
    while($row = $res->fetch_assoc()) {
      $infolist[] = $row;
  }

    echo json_encode($infolist);
}

  function addClient($conn, $data) {
    $name = $data['name'];
    $inn = $data['inn'];
    $phone = $data['phone'];

    $stmt = $conn->prepare("INSERT INTO Client (NAME, INN, representative_phone) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $inn, $phone);

    if ($stmt->execute()) {
      $res = [
        "status" => true,
        "post_id" => mysqli_insert_id($conn)
      ];

      http_response_code(201);
    } else {
      $res = [
        "status" => false,
        "error" => $conn->error
      ];

      http_response_code(500);
    }

    echo json_encode($res);
  }


  function addEmployee($conn, $data) {
    $full_name = $data['full_name'];
    $birth = $data['birth'];
    $wage = $data['wage'];

    $stmt = $conn->prepare("INSERT INTO Employee (full_name, birth_date, salary) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $full_name, $birth, $wage);

    if ($stmt->execute()) {
      $res = [
        "status" => true,
        "post_id" => mysqli_insert_id($conn)
      ];

      http_response_code(201);
    } else {
      $res = [
        "status" => false,
        "error" => $conn->error
      ];

      http_response_code(500);
    }

    echo json_encode($res);
  }

  function addContract($conn, $data) {
    $date_signed = $data['date_signed'];
    $date_end = $data['date_end'];
    $contract_amount = $data['contract_amount'];
    $id_client = $data['id_client'];

    $check_stmt = $conn->prepare("SELECT id FROM Client WHERE id = ?");
    $check_stmt->bind_param("s", $id_client);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();

    if ($check_result->num_rows == 0) {
        $res = [
            "status" => false,
            "error" => "Client with id $id_client does not exist"
        ];
        http_response_code(400);
        echo json_encode($res);
        return;
    }

    $overlap_stmt = $conn->prepare("SELECT * FROM Contract WHERE client_id = ? AND ((start_date <= ? AND end_date >= ?) OR (start_date >= ? AND start_date <= ?))");
    $overlap_stmt->bind_param("sssss", $id_client, $date_signed, $date_end, $date_signed, $date_end);
    $overlap_stmt->execute();
    $overlap_result = $overlap_stmt->get_result();

    if ($overlap_result->num_rows > 0) {
        $res = [
            "status" => false,
            "error" => "Contract dates overlap with existing contract for client $id_client"
        ];
        http_response_code(400);
        echo json_encode($res);
        return;
    }

    $stmt = $conn->prepare("INSERT INTO Contract (start_date, end_date, amount, client_id) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $date_signed, $date_end, $contract_amount, $id_client);

    if ($stmt->execute()) {
      $res = [
        "status" => true,
        "post_id" => mysqli_insert_id($conn)
      ];

      http_response_code(201);
    } else {
      $res = [
        "status" => false,
        "error" => $conn->error
      ];

      http_response_code(500);
    }

    echo json_encode($res);
}



  function updatePost($conn, $id, $name, $inn, $phone) {
    $stmt = $conn->prepare('UPDATE Client SET NAME = ?, INN = ?, representative_phone = ? WHERE id = ?');
    $stmt->bind_param('sssi', $name, $inn, $phone, $id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
      http_response_code(204);
    } else {
      http_response_code(404);
      echo json_encode(['error' => 'Record not found']);
    }
  }

  function deletePost($conn, $id) {
    $sql = "DELETE FROM Client WHERE `Client`.`id` = ${id}";
    $result = $conn->query($sql);

    echo json_encode($result);
  }

  function deleteContract($conn,$id){
    $sql = "DELETE FROM Contract WHERE `Contract`.`id` = ${id}";
    $result = $conn->query($sql);

    echo json_encode($result);
  }
?>