package com.qkss.map.repository;

import com.qkss.map.model.Pin;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PinRepository extends MongoRepository<Pin,String> { }
