package com.cakedelight.order.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String ORDER_QUEUE = "order.completed.queue";
    public static final String ORDER_EXCHANGE = "order.exchange";
    public static final String ORDER_ROUTING_KEY = "order.completed.key";

    @Bean
    public Queue orderQueue() {
        return new Queue(ORDER_QUEUE, true);
    }

    @Bean
    public TopicExchange orderExchange() {
        return new TopicExchange(ORDER_EXCHANGE);
    }

    @Bean
    public Binding orderBinding(
            Queue orderQueue,
            TopicExchange orderExchange) {

        return BindingBuilder
                .bind(orderQueue)
                .to(orderExchange)
                .with(ORDER_ROUTING_KEY);
    }

    @Bean
    public JacksonJsonMessageConverter messageConverter() {
        return new JacksonJsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(
            ConnectionFactory connectionFactory,
            JacksonJsonMessageConverter messageConverter) {

        RabbitTemplate rabbitTemplate =
                new RabbitTemplate(connectionFactory);

        rabbitTemplate.setMessageConverter(messageConverter);

        return rabbitTemplate;
    }
}